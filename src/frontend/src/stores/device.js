import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useDeviceStore = defineStore("device", () => {
  // 상태
  const devices = ref([]);
  const activeDeviceId = ref(null);
  const showIssueOnly = ref(false);
  const searchQuery = ref("");
  const searchType = ref("name");
  const loading = ref(false);
  const error = ref(null);

  // 게터
  const activeDevice = computed(() => {
    return devices.value.find((device) => device.id === activeDeviceId.value);
  });

  const filteredDevices = computed(() => {
    let result = devices.value;

    // 검색 필터
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      result = result.filter((device) => {
        const field =
          searchType.value === "addr"
            ? device.addr
            : searchType.value === "id"
              ? device.id
              : device.name;
        return field.toLowerCase().includes(q);
      });
    }

    // 이슈 필터
    if (showIssueOnly.value) {
      result = result.filter((device) => {
        if (!device.online || device.water === null) return true;
        return device.water >= 70;
      });
    }

    return result;
  });

  const deviceStats = computed(() => {
    const total = filteredDevices.value.length || 1;
    let ok = 0,
      warn = 0,
      crit = 0,
      unk = 0;

    filteredDevices.value.forEach((device) => {
      if (!device.online || device.water === null) {
        unk++;
      } else if (device.water >= 90) {
        crit++;
      } else if (device.water >= 70) {
        warn++;
      } else {
        ok++;
      }
    });

    return {
      ok,
      warn,
      crit,
      unk,
      total,
      pctOk: Math.round((ok / total) * 100),
      pctWarn: Math.round((warn / total) * 100),
      pctCrit: Math.round((crit / total) * 100),
      pctUnk: Math.max(
        0,
        100 -
          Math.round((ok / total) * 100) -
          Math.round((warn / total) * 100) -
          Math.round((crit / total) * 100),
      ),
    };
  });

  // 액션
  function setActiveDevice(id) {
    activeDeviceId.value = id;
  }

  function updateDeviceWater(id, waterLevel) {
    const device = devices.value.find((d) => d.id === id);
    if (device) {
      device.water = waterLevel;
      device.updatedAt = Date.now();
    }
  }

  function toggleIssueFilter() {
    showIssueOnly.value = !showIssueOnly.value;
  }

  function setSearch(query, type = "name") {
    searchQuery.value = query;
    searchType.value = type;
  }

  function clearSearch() {
    searchQuery.value = "";
    searchType.value = "name";
  }

  async function fetchDevices() {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch("/api/devices");
      if (!response.ok) throw new Error("Failed to fetch devices");
      const data = await response.json();
      devices.value = data;
      if (!activeDeviceId.value && data.length > 0) {
        activeDeviceId.value = data[0].id;
      }
    } catch (e) {
      error.value = e.message;
      console.error("fetchDevices error:", e);
    } finally {
      loading.value = false;
    }
  }

  // 주기적 갱신
  function startPolling(interval = 30000) {
    fetchDevices();
    setInterval(() => {
      fetchDevices();
    }, interval);
  }

  return {
    // 상태
    devices,
    activeDeviceId,
    showIssueOnly,
    searchQuery,
    searchType,
    loading,
    error,

    // 게터
    activeDevice,
    filteredDevices,
    deviceStats,

    // 액션
    setActiveDevice,
    updateDeviceWater,
    toggleIssueFilter,
    setSearch,
    clearSearch,
    fetchDevices,
    startPolling,
  };
});

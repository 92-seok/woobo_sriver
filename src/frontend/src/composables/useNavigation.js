import { useRouter } from "vue-router";
import { useDeviceStore } from "@/stores/device";

export function useNavigation() {
  const router = useRouter();
  const deviceStore = useDeviceStore();

  // 메인페이지 (수위)
  function goToMain() {
    router.push("/");
  }

  function goToDetail(deviceId = null) {
    const id =
      deviceId || deviceStore.activeDeviceId || deviceStore.devices[0]?.id;
    if (id) {
      router.push({ name: "Detail", params: { id } });
    }
  }

  function goToReport() {}

  return {
    goToMain,
    goToDetail,
    goToReport,
  };
}

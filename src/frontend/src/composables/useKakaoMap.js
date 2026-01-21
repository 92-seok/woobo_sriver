import { ref, onMounted, onUnmounted } from "vue";

const KAKAO_SDK_URL = "https://dapi.kakao.com/v2/maps/sdk.js";

// SDK 로드 상태 (앱 전역에서 한 번만 로드)
let sdkLoaded = false;
let sdkLoadPromise = null;

/**
 * 카카오맵 SDK 동적 로드
 */
function loadKakaoSDK() {
  if (sdkLoaded) {
    return Promise.resolve();
  }

  if (sdkLoadPromise) {
    return sdkLoadPromise;
  }

  sdkLoadPromise = new Promise((resolve, reject) => {
    // 이미 완전히 로드된 경우 체크 (LatLng 클래스 존재 여부로 확인)
    if (window.kakao && window.kakao.maps && window.kakao.maps.LatLng) {
      sdkLoaded = true;
      resolve();
      return;
    }

    // SDK는 로드되었지만 autoload=false로 클래스들이 아직 초기화 안 된 경우
    if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
      window.kakao.maps.load(() => {
        sdkLoaded = true;
        resolve();
      });
      return;
    }

    const script = document.createElement("script");
    const apiKey = import.meta.env.VITE_KAKAO_JS_KEY;

    if (!apiKey) {
      reject(new Error("VITE_KAKAO_JS_KEY가 .env에 설정되지 않았습니다."));
      return;
    }

    script.src = `${KAKAO_SDK_URL}?appkey=${apiKey}&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        sdkLoaded = true;
        resolve();
      });
    };

    script.onerror = () => {
      reject(new Error("카카오맵 SDK 로드 실패"));
    };

    document.head.appendChild(script);
  });

  return sdkLoadPromise;
}

/**
 * 카카오맵 Composable
 * @param {Object} options - 지도 옵션
 * @param {number} options.lat - 초기 중심 위도
 * @param {number} options.lng - 초기 중심 경도
 * @param {number} options.level - 초기 줌 레벨
 */
export function useKakaoMap(options = {}) {
  const { lat = 36.5, lng = 128.0, level = 10 } = options;

  const map = ref(null);
  const isLoaded = ref(false);
  const error = ref(null);
  const markers = ref([]);

  /**
   * 지도 초기화
   * @param {string|HTMLElement} container - 지도 컨테이너 ID 또는 엘리먼트
   */
  async function initMap(container) {
    try {
      await loadKakaoSDK();

      const containerEl =
        typeof container === "string"
          ? document.getElementById(container)
          : container;

      if (!containerEl) {
        throw new Error("지도 컨테이너를 찾을 수 없습니다.");
      }

      const mapOptions = {
        center: new window.kakao.maps.LatLng(lat, lng),
        level,
        mapTypeId: window.kakao.maps.MapTypeId.HYBRID, // 위성 + 라벨
      };

      map.value = new window.kakao.maps.Map(containerEl, mapOptions);

      // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
      var mapTypeControl = new window.kakao.maps.MapTypeControl();

      // 지도 타입 컨트롤을 지도에 표시합니다
      map.value.addControl(
        mapTypeControl,
        window.kakao.maps.ControlPosition.TOPRIGHT,
      );

      // 지도 확대 축소를 제어할 수 있는 줌 컨트롤을 생성합니다.
      var zoomControl = new window.kakao.maps.ZoomControl();
      map.value.addControl(
        zoomControl,
        window.kakao.maps.ControlPosition.RIGHT,
      );

      isLoaded.value = true;
    } catch (e) {
      error.value = e.message;
      console.error("카카오맵 초기화 실패:", e);
    }
  }

  /**
   * 마커 생성
   * @param {Object} options - 마커 옵션
   * @param {number} options.lat - 위도
   * @param {number} options.lng - 경도
   * @param {string} options.imageSrc - 커스텀 마커 이미지 (선택)
   * @param {Function} options.onClick - 클릭 핸들러 (선택)
   */
  function addMarker({ lat, lng, imageSrc, imageSize, onClick }) {
    if (!map.value) return null;

    const position = new window.kakao.maps.LatLng(lat, lng);

    const markerOptions = {
      position,
      map: map.value,
    };

    // 커스텀 마커 이미지
    if (imageSrc) {
      const size = imageSize || new window.kakao.maps.Size(24, 35);
      markerOptions.image = new window.kakao.maps.MarkerImage(imageSrc, size);
    }

    const marker = new window.kakao.maps.Marker(markerOptions);

    // 클릭 이벤트
    if (onClick) {
      window.kakao.maps.event.addListener(marker, "click", onClick);
    }

    markers.value.push(marker);
    return marker;
  }

  /**
   * 모든 마커 제거
   */
  function clearMarkers() {
    markers.value.forEach((marker) => marker.setMap(null));
    markers.value = [];
  }

  /**
   * 지도 중심 이동
   */
  function setCenter(lat, lng) {
    if (!map.value) return;
    const position = new window.kakao.maps.LatLng(lat, lng);
    map.value.setCenter(position);
  }

  /**
   * 지도 중심 부드럽게 이동
   */
  function panTo(lat, lng) {
    if (!map.value) return;
    const position = new window.kakao.maps.LatLng(lat, lng);
    map.value.panTo(position);
  }

  /**
   * 줌 레벨 설정
   */
  function setLevel(level) {
    if (!map.value) return;
    map.value.setLevel(level);
  }

  /**
   * 커스텀 오버레이 생성
   */
  function addCustomOverlay({ lat, lng, content, yAnchor = 1 }) {
    if (!map.value) return null;

    const position = new window.kakao.maps.LatLng(lat, lng);
    const overlay = new window.kakao.maps.CustomOverlay({
      position,
      content,
      yAnchor,
    });

    overlay.setMap(map.value);
    return overlay;
  }

  // cleanup
  onUnmounted(() => {
    clearMarkers();
  });

  return {
    map,
    isLoaded,
    error,
    markers,
    initMap,
    addMarker,
    clearMarkers,
    setCenter,
    panTo,
    setLevel,
    addCustomOverlay,
  };
}

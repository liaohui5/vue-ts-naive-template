import { ref, useTemplateRef } from "vue";

export function useMaximize() {
  const targetRef = useTemplateRef<HTMLDivElement | null>("targetRef");
  const isMaximized = ref(false);

  async function maximize() {
    if (!targetRef.value) {
      return;
    }
    const maximizeClasses = [
      "fixed",
      "top-0",
      "left-0",
      "w-screen",
      "h-screen",
      "bg-white",
      "!overflow-y-auto",
      "z-[999999999]",
    ];

    if (isMaximized.value) {
      targetRef.value.classList.remove(...maximizeClasses);
      isMaximized.value = false;
    } else {
      targetRef.value.classList.add(...maximizeClasses);
      isMaximized.value = true;
    }
  }

  return {
    targetRef,
    maximize,
    isMaximized,
  };
}

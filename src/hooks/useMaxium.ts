import { ref, useTemplateRef } from "vue";

/**
 * 切换元素浏览器网页全屏显示, 注意不是显示器全屏
 * 需需要切换的元素绑定 ref="targetMaximizeRef"
 * @returns {Object} - 一个对象, 包含 targetRef, toggle, isMaximized三个属性
 * @property {HTMLDivElement | null} targetRef - 一个 ref, 指向要切换的元素
 * @property {Function} toggle - 一个函数, 用于切换元素的全屏状态
 * @property {Ref<boolean>} isMaximized - 一个 ref, 指向当前元素是否处于全屏状态
 */
export function useMaximize() {
  const targetRef = useTemplateRef<HTMLDivElement | null>("targetMaximizeRef");
  const isMaximized = ref(false);

  /**
   * 切换元素的全屏状态
   */
  function toggle() {
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
    toggle,
    isMaximized,
  };
}

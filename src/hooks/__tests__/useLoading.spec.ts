import { describe, it, expect } from "vitest";
import { useLoading } from "@/hooks/useLoading";

describe("useLoading", () => {
  it("should return initial value", () => {
    const $loading = useLoading();
    expect($loading.isLoading.value).toBe(false);
  });

  it("should show loading", () => {
    const $loading = useLoading();
    $loading.show();
    expect($loading.isLoading.value).toBe(true);
  });

  it("should hide loading", () => {
    const $loading = useLoading();
    $loading.hide();
    expect($loading.isLoading.value).toBe(false);
  });
});

<template>
  <n-modal
    :show="props.visible"
    :loading="props.isLoading"
    :showIcon="false"
    negativeText="取消"
    positiveText="确定"
    transformOrigin="center"
    preset="dialog"
    title="创建文章"
    class="!w-1/2 !mt-32"
    @negativeClick="handleCancel"
    @close="handleCancel"
    @positiveClick="handleConfirm"
  >
    <n-form>
      <n-form-item v-bind="titleProp">
        <n-input v-model:value="title" placeholder="请输入文章标题" />
      </n-form-item>
      <n-form-item v-bind="contentProp">
        <n-input v-model:value="content" placeholder="请输入文章内容" />
      </n-form-item>
      <n-form-item v-bind="authorProp">
        <n-input v-model:value="author" placeholder="请输入文章内容" />
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script lang="ts" setup>
import type { ICreateArticleForm } from "@/types/article";
import type { FormItemProps } from "naive-ui";
import { useForm } from "vee-validate";
import { createArticleZod } from "./rules";

const emits = defineEmits(["cancel", "confirm"]);
const props = defineProps<{
  visible: boolean;
  isLoading: boolean;
}>();

const { defineField, handleSubmit, resetForm } = useForm<ICreateArticleForm>({
  validationSchema: createArticleZod,
  initialValues: {
    title: "",
    content: "",
    author: "",
  },
});

const [title, titleProp] = defineField("title", (state: any) => ({
  props: {
    validationStatus: state.errors[0] ? "error" : undefined,
    feedback: state.errors[0],
    label: "标题",
    required: true,
  } as FormItemProps,
}));

const [content, contentProp] = defineField("content", (state: any) => ({
  props: {
    validationStatus: state.errors[0] ? "error" : undefined,
    feedback: state.errors[0],
    label: "文章内容",
    required: true,
  } as FormItemProps,
}));

const [author, authorProp] = defineField("author", (state: any) => ({
  props: {
    validationStatus: state.errors[0] ? "error" : undefined,
    feedback: state.errors[0],
    label: "作者",
    required: true,
  } as FormItemProps,
}));

const handleConfirm = handleSubmit((values) => emits("confirm", values));
const handleCancel = () => {
  resetForm();
  emits("cancel");
};
</script>

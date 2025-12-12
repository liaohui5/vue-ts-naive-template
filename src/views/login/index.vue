<template>
  <div class="w-screen h-screen overflow-hidden flex items-center justify-center">
    <div class="w-1/4">
      <n-card>
        <template #header>
          <div class="text-center">
            <h2 class="text-lg">登录</h2>
          </div>
        </template>

        <n-form>
          <n-form-item v-bind="accountProp">
            <n-input v-model:value="account" placeholder="请输入邮箱/手机号码" />
          </n-form-item>

          <n-form-item v-bind="passwordProp">
            <n-input v-model:value="password" type="password" placeholder="密码" />
          </n-form-item>
        </n-form>

        <div class="flex justify-evenly">
          <n-button @click="resetForm()" type="error">重 置</n-button>
          <n-button @click="submitForm" type="primary" :disabled="store.isLoading">登 录</n-button>
        </div>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import { useAuth } from "@/store";
import { loginZod, type ILoginForm } from "@/validation";
import type { FormItemProps } from "naive-ui";

const store = useAuth();

const { defineField, handleSubmit, resetForm } = useForm<ILoginForm>({
  validationSchema: loginZod,
  initialValues: {
    account: "",
    password: "",
  },
});

const [account, accountProp] = defineField("account", (state: any) => ({
  props: {
    validationStatus: state.errors[0] ? "error" : undefined,
    feedback: state.errors[0],
    label: "账号",
    required: true,
  } as FormItemProps,
}));
const [password, passwordProp] = defineField("password", (state: any) => ({
  props: {
    validationStatus: state.errors[0] ? "error" : undefined,
    feedback: state.errors[0],
    label: "密码",
    required: true,
  } as FormItemProps,
}));

// validate first
const submitForm = handleSubmit(store.login);
</script>

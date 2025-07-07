<template>
  <el-container style="min-height: 100vh">
    <el-aside
      :width="collapsed ? '64px' : '200px'"
      class="sidebar"
    >
      <el-menu
        :default-active="selectedKeys[0]"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        :collapse="collapsed"
        @select="onMenuSelect"
      >
        <el-menu-item
          v-for="route in routes"
          :key="route.path"
          :index="route.path"
        >
          <el-icon v-if="route.meta?.icon">
            <component :is="route.meta.icon" />
          </el-icon>
          <span>{{ route.meta?.title }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="padding: 0 24px">
        <h2>{{ pageTitle }}</h2>
      </el-header>
      <el-main style="margin: 24px 16px">
        <div style="min-height: 360px; padding: 24px">
          <router-view />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { routes } from '@/router';

const collapsed = ref<boolean>(false);
const selectedKeys = ref<string[]>(['/demo']);
const router = useRouter();

const pageTitle = computed(() => {
  return routes.filter((item) => item.path === selectedKeys.value[0]).pop()?.meta?.title + '演示';
});

const onMenuSelect = (key: string) => {
  router.push(key);
};
</script>

<style scoped>
.sidebar {
  background-color: #304156;
}
</style>

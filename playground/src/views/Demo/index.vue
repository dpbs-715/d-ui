<script setup lang="ts">
import { asyncCache, CACHE_TYPE } from 'dlib-utils';

function mockApi() {
  return new Promise((resolve) => {
    console.log('sendApi');
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          name: 'mock',
          age: 18,
        },
        message: 'success',
      });
    }, 5000);
  });
}

const mockApiPlus = asyncCache(mockApi, {
  cacheType: CACHE_TYPE.localStorage,
  version: 'v1.0.1',
  expireTime: 1000 * 10,
});

mockApiPlus({ param1: 'data1', param2: 'data2' }).then((res) => {
  console.log(res);
});
</script>

<template>
  <div />
</template>

<style scoped></style>

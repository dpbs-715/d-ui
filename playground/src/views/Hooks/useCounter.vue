<template>
  <el-button @click="increment">
    +
  </el-button>
  <el-button @click="decrement">
    -
  </el-button>
  <div>{{ count }}</div>
</template>

<script setup lang="ts">
import { useCounter } from '@DLib/hooks';

const { count, increment, decrement } = useCounter();
</script>

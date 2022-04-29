<template>
  <div :class="{ 'w-input': true, active: focus  }">
    <input type="text" :placeholder="placeholder" :value="modelValue" @keydown="emits('keydown', $event)"
      @focus="e => focusState(e, true)" @blur="e => focusState(e, false)" @input="input">
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

defineProps({
  modelValue: String,
  placeholder: String
})

const emits = defineEmits(['focus', 'blur', 'input', 'update:modelValue', 'keydown'])

const focus = ref(false)

const focusState = (e, _focus) => {
  focus.value = _focus
  emits(_focus ? 'focus' : 'blur', e)
}

function input(e) {
  emits('update:modelValue', e.target.value)
  emits('input', e)
}

</script>

<style scope>
.w-input {
  display: inline-block;
  position: relative;
  border: 1px solid #d9d9d9;
  box-sizing: border-box;
  transition: .3s all;
  border-radius: 2px;
  width: 100%;
}

.w-input input {
  width: 100%;
  min-height: 32px;
  height: 100%;
  outline: none;
  border: none;
  padding: 0 10px;
  box-sizing: border-box;
}

.w-input:hover {
  border-color: var(--primary-1)
}

.w-input.active {
  border-color: var(--primary-1);
  box-shadow: 0 0 0 2px var(--outline-color);
}
</style>
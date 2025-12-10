<template>
  <div class="country-autocomplete">
    <div class="search-container">
      <LabeledInput
        label="Country"
        v-model="search"
        placeholder="Enter your country"
        @keydown.down.prevent="moveDown"
        @keydown.up.prevent="moveUp"
        @keydown.enter.prevent="selectActive"
        @focus="onFocus"
        @blur="onBlur"
      />
    </div>

    <div v-if="focused && search.length >= 2" class="results-container">
      <div v-if="error" class="empty-state">{{ error }}</div>

      <div
        v-for="(item, index) in results"
        :key="index"
        class="result-item"
        :class="{ active: index === activeIndex }"
        @mouseenter="activeIndex = index"
        @mouseleave="activeIndex = -1"
        @mousedown.prevent="selectCountry(item)"
      >
        {{ item.name }} {{ item.flag }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import _ from 'lodash'
import LabeledInput from '@/components/molecules/LabeledInput.vue'

const props = defineProps({
  modelValue: String,
})
const emit = defineEmits(['update:modelValue', 'select'])

const search = ref(props.modelValue || '')
const results = ref([])
const error = ref('')
const activeIndex = ref(-1)
const focused = ref(false)

let blurTimeout = null

const fetchCountries = async () => {
  if (search.value.length < 2) {
    results.value = []
    error.value = 'Type at least 2 characters'
    return
  }

  error.value = ''
  results.value = []

  try {
    const res = await axios.get('https://restcountries.com/v3.1/name/' + search.value)
    results.value = res.data.map((c) => ({
      name: c.name.common,
      flag: c.flag,
      code: c.cca2,
    }))
  } catch (err) {
    error.value = 'No results found'
  }
}

const debouncedFetch = _.debounce(fetchCountries, 300)

watch(search, () => {
  emit('update:modelValue', search.value)
  debouncedFetch()
})

function onFocus() {
  focused.value = true
  if (blurTimeout) {
    clearTimeout(blurTimeout)
    blurTimeout = null
  }
}

function onBlur() {
  // delay hiding so clicks on results register
  blurTimeout = setTimeout(() => {
    focused.value = false
  }, 120)
}

const selectCountry = (item) => {
  search.value = item.name
  emit('update:modelValue', item.name)
  emit('select', item)
  results.value = []
  activeIndex.value = -1
  // Unfocus the input so the dropdown hides immediately
  try {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  } catch (e) {
    // ignore
  }
  focused.value = false
}

const moveDown = () => {
  if (results.value.length === 0) return
  activeIndex.value = (activeIndex.value + 1) % results.value.length
}

const moveUp = () => {
  if (results.value.length === 0) return
  activeIndex.value = activeIndex.value <= 0 ? results.value.length - 1 : activeIndex.value - 1
}

const selectActive = () => {
  if (activeIndex.value >= 0 && results.value[activeIndex.value]) {
    selectCountry(results.value[activeIndex.value])
  }
}
</script>

<style scoped>
.country-autocomplete {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-container {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 1rem;
  color: #667eea;
}

.results-container {
  display: flex;
  flex-direction: column;
  max-height: 300px;
  overflow-y: auto;
  border-radius: 12px;
  background: #1e1e2a; /* Dark dropdown background */
  padding: 6px 0;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.1); /* Subtle border */
}

.result-item {
  padding: 12px 16px;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;
  color: #e5e7f0; /* Light text */
}

.result-item:hover,
.result-item.active {
  background: #2a2a3a; /* Softer highlight */
  color: #ffffff;
}

.empty-state {
  color: #a0a3b1;
  padding: 10px 16px;
}
</style>

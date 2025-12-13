<template>
  <div class="country-autocomplete">
    <LabeledSelect
      label="Country"
      v-model="selectedCountryLabel"
      :options="countryOptions"
      placeholder="Select a country"
      @update:modelValue="onCountrySelected"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import LabeledSelect from '@/components/molecules/LabeledSelect.vue'

const props = defineProps({
  modelValue: String,
})
const emit = defineEmits(['update:modelValue', 'select'])

const selectedCountryCode = ref('')
const selectedCountryLabel = ref('')
const countries = ref([])
const error = ref('')

const DACH_CODES = ['DE', 'AT', 'CH'] // Germany, Austria, Switzerland

const fetchAllCountries = async () => {
  try {
    const res = await axios.get('https://restcountries.com/v3.1/all?fields=name,cca2,flag')

    const allCountries = res.data.map((c) => ({
      name: c.name.common,
      flag: c.flag,
      code: c.cca2,
    }))

    // Sort: DACH first, then rest alphabetically
    const dachCountries = allCountries.filter((c) => DACH_CODES.includes(c.code))
    const otherCountries = allCountries
      .filter((c) => !DACH_CODES.includes(c.code))
      .sort((a, b) => a.name.localeCompare(b.name))

    countries.value = [...dachCountries, ...otherCountries]
    error.value = ''
  } catch (err) {
    error.value = 'Failed to load countries'
    // Alternatively, we could set a default list of countries here
    countries.value = []
  }
}

onMounted(() => {
  fetchAllCountries()
})

const countryOptions = computed(() => countries.value.map((c) => `${c.name} ${c.flag}`))
const onCountrySelected = (label) => {
  const selected = countries.value.find((c) => `${c.name} ${c.flag}` === label)
  if (selected) {
    selectedCountryCode.value = selected.code
    selectedCountryLabel.value = label
    emit('update:modelValue', selected.name)
    emit('select', selected)
  }
}
</script>

<style scoped>
.country-autocomplete {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>

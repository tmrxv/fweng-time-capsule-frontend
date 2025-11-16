<script setup>
const props = defineProps({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    default: '',
  },
  profileImageUrl: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <section
    class="flex items-center gap-4 p-4 rounded-xl bg-medium-dark-blue border border-dark shadow-md"
  >
    <div
      class="w-14 h-14 rounded-full bg-dark-blue flex items-center justify-center overflow-hidden text-lightest-blue text-lg font-semibold"
    >
      <img
        v-if="profileImageUrl"
        :src="profileImageUrl"
        alt="Profile"
        class="w-full h-full object-cover"
      />
      <span v-else>
        {{ username.charAt(0).toUpperCase() }}
      </span>
    </div>

    <div class="flex-1">
      <p class="text-sm font-semibold text-lightest-blue">
        {{ username }}
      </p>
      <p class="text-xs text-lightest-blue/70">
        {{ email }}
      </p>
      <p v-if="country" class="text-xs text-lightest-blue/50 mt-1">
        Country: {{ country }}
      </p>
    </div>
  </section>
</template>

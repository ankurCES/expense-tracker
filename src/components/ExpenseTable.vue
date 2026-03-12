<template>
  <div class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
    <div class="bg-gray-50 border-b border-gray-200 px-4 py-3 flex justify-between items-center">
      <h3 class="font-medium text-gray-700">Expense Categorization</h3>
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium" :class="showExcluded ? 'text-gray-900' : 'text-gray-500'">Show Excluded Items</span>
        <button 
          @click="showExcluded = !showExcluded"
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          :class="showExcluded ? 'bg-blue-600' : 'bg-gray-200'"
        >
          <span class="sr-only">Toggle excluded items</span>
          <span 
            class="inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out shadow-sm"
            :class="showExcluded ? 'translate-x-6' : 'translate-x-1'"
          />
        </button>
      </div>
    </div>

    <div class="overflow-x-auto pb-4">
      <table class="min-w-full divide-y divide-gray-200 text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Client</th>
            <th class="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Line Item</th>
            <th class="px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200">Air</th>
            <th class="px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200">Cab/Taxi</th>
            <th class="px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200">Hotel</th>
            <th class="px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200">Food</th>
            <th class="px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200">Misc</th>
            <th class="px-4 py-3 text-center font-medium text-red-500 uppercase tracking-wider border-l border-gray-200 bg-red-50">Exclude</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr 
            v-for="expense in visibleExpenses" 
            :key="expense.id" 
            :class="[
              expense.category === 'excluded' ? 'bg-red-50/50 opacity-75' : 'hover:bg-gray-50'
            ]"
            class="transition-colors"
          >
            <td class="px-4 py-3 whitespace-nowrap text-gray-900" :class="{'line-through text-gray-400': expense.category === 'excluded'}">{{ expense.date }}</td>
            
            <td class="px-2 py-2">
              <input 
                type="text" 
                v-model="expense.client_name" 
                list="client-datalist" 
                placeholder="Assign client..." 
                class="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                :disabled="expense.category === 'excluded'"
              />
            </td>

            <td class="px-4 py-3 text-gray-900 max-w-[200px] truncate" :title="expense.line_item">
              <span :class="{'line-through text-gray-400': expense.category === 'excluded'}">{{ expense.line_item }}</span>
            </td>
            
            <td class="px-4 py-3 text-center border-l border-gray-200 transition-colors" :class="expense.category === 'air_travel' ? 'bg-blue-50/50' : ''">
              <input type="radio" :name="expense.id" value="air_travel" v-model="expense.category" class="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer">
              <div v-if="expense.category === 'air_travel'" class="mt-1 font-semibold text-gray-900">${{ expense.amount.toFixed(2) }}</div>
            </td>
            <td class="px-4 py-3 text-center border-l border-gray-200 transition-colors" :class="expense.category === 'cab_taxi' ? 'bg-orange-50/50' : ''">
              <input type="radio" :name="expense.id" value="cab_taxi" v-model="expense.category" class="w-4 h-4 text-orange-600 focus:ring-orange-500 cursor-pointer">
              <div v-if="expense.category === 'cab_taxi'" class="mt-1 font-semibold text-gray-900">${{ expense.amount.toFixed(2) }}</div>
            </td>
            <td class="px-4 py-3 text-center border-l border-gray-200 transition-colors" :class="expense.category === 'hotel' ? 'bg-purple-50/50' : ''">
              <input type="radio" :name="expense.id" value="hotel" v-model="expense.category" class="w-4 h-4 text-purple-600 focus:ring-purple-500 cursor-pointer">
              <div v-if="expense.category === 'hotel'" class="mt-1 font-semibold text-gray-900">${{ expense.amount.toFixed(2) }}</div>
            </td>
            <td class="px-4 py-3 text-center border-l border-gray-200 transition-colors" :class="expense.category === 'food_beverage' ? 'bg-green-50/50' : ''">
              <input type="radio" :name="expense.id" value="food_beverage" v-model="expense.category" class="w-4 h-4 text-green-600 focus:ring-green-500 cursor-pointer">
              <div v-if="expense.category === 'food_beverage'" class="mt-1 font-semibold text-gray-900">${{ expense.amount.toFixed(2) }}</div>
            </td>
            <td class="px-4 py-3 text-center border-l border-gray-200 transition-colors" :class="expense.category === 'misc' ? 'bg-gray-100/50' : ''">
              <input type="radio" :name="expense.id" value="misc" v-model="expense.category" class="w-4 h-4 text-gray-600 focus:ring-gray-500 cursor-pointer">
              <div v-if="expense.category === 'misc'" class="mt-1 font-semibold text-gray-900">${{ expense.amount.toFixed(2) }}</div>
            </td>

            <td class="px-4 py-3 text-center border-l border-gray-200 bg-red-50/30 transition-colors" :class="expense.category === 'excluded' ? 'bg-red-100/50' : ''">
              <div v-if="expense.category !== 'excluded'">
                <input type="radio" :name="expense.id" value="excluded" v-model="expense.category" class="w-4 h-4 text-red-600 focus:ring-red-500 cursor-pointer">
              </div>
              <div v-if="expense.category === 'excluded'" class="flex flex-col items-center">
                <div class="font-semibold text-gray-900 line-through">${{ expense.amount.toFixed(2) }}</div>
                <button 
                  @click="expense.category = 'misc'" 
                  class="mt-2 text-xs px-2 py-1 font-medium bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors shadow-sm w-full"
                >
                  Include
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Shared Datalist for Client Dropdowns -->
      <datalist id="client-datalist">
        <option v-for="client in clients" :key="client" :value="client"></option>
      </datalist>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ExpenseRecord } from '../services/ollamaAgent';

const props = defineProps<{
  modelValue: ExpenseRecord[],
  clients: string[]
}>();

const emit = defineEmits(['update:modelValue']);
const showExcluded = ref(false);

const visibleExpenses = computed(() => {
  if (showExcluded.value) return props.modelValue;
  return props.modelValue.filter(item => item.category !== 'excluded');
});
</script>

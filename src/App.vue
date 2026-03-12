<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-blue-600 text-white rounded flex items-center justify-center font-bold text-xl">E</div>
        <h1 class="text-xl font-semibold text-gray-900 tracking-tight">AI Expense Tracker</h1>
      </div>
      <div class="flex gap-3" v-if="expenses.length > 0">
        <button @click="clearData" class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50 shadow-sm transition-all">
          Clear
        </button>
        <button @click="downloadExcel" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm transition-all flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Approve & Download Excel
        </button>
      </div>
    </header>

    <main class="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col gap-6">
      
      <!-- Settings Panel -->
      <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Application Settings</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- API Key Config -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
              Ollama Cloud API Key
            </label>
            <input 
              type="password" 
              v-model="apiKey" 
              placeholder="Paste your API key here..." 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm font-mono" 
            />
          </div>

          <!-- Master Client List -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              Master Client List (Comma-separated)
            </label>
            <input 
              type="text" 
              v-model="rawClientList" 
              placeholder="e.g. Acme Corp, Globex, Initech" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" 
            />
          </div>

          <!-- Company Meta -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-gray-700">Company Name</label>
            <input type="text" v-model="companyName" placeholder="e.g. Wayne Enterprises" class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" />
          </div>

          <!-- Employee Meta -->
          <div class="flex flex-col gap-2 md:flex-row">
            <div class="flex-1 flex flex-col gap-2">
                <label class="text-sm font-semibold text-gray-700">Employee Name</label>
                <input type="text" v-model="employeeName" placeholder="e.g. Bruce Wayne" class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" />
            </div>
            <div class="flex-1 flex flex-col gap-2">
                <label class="text-sm font-semibold text-gray-700">Designation <span class="text-gray-400 font-normal">(Optional)</span></label>
                <input type="text" v-model="designation" placeholder="e.g. CEO" class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm" />
            </div>
          </div>

        </div>
      </div>

      <!-- Summary Dashboard -->
      <div v-if="expenses.length > 0" class="grid grid-cols-4 gap-4">
        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div class="text-sm text-gray-500 font-medium mb-1">Total Approved</div>
          <div class="text-2xl font-bold text-gray-900">${{ totalSpent.toFixed(2) }}</div>
        </div>
        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div class="text-sm text-gray-500 font-medium mb-1">Air / Travel</div>
          <div class="text-xl font-bold text-blue-600">${{ getCategoryTotal('air_travel').toFixed(2) }}</div>
        </div>
        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div class="text-sm text-gray-500 font-medium mb-1">Hotel & Lodging</div>
          <div class="text-xl font-bold text-purple-600">${{ getCategoryTotal('hotel').toFixed(2) }}</div>
        </div>
        <div class="bg-white p-4 rounded-xl border border-red-200 shadow-sm bg-red-50/30">
          <div class="text-sm text-red-500 font-medium mb-1">Total Excluded</div>
          <div class="text-xl font-bold text-red-600">${{ getCategoryTotal('excluded').toFixed(2) }}</div>
        </div>
      </div>

      <!-- File Uploader -->
      <div v-if="expenses.length === 0" class="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl bg-white m-4 transition-colors relative" :class="{'border-blue-500 bg-blue-50': isDragging}" @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop">
        <div v-if="isProcessing" class="flex flex-col items-center gap-4">
          <div class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div class="text-lg font-medium text-gray-700">AI is analyzing statement images...</div>
          <div class="text-sm text-gray-500 text-center max-w-md">Extracting text directly via Qwen Vision Language Model. Categorizing line items...</div>
        </div>
        <div v-else class="flex flex-col items-center gap-2">
          <svg class="w-12 h-12 text-gray-400 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="text-lg font-semibold text-gray-900">Upload Credit Card Statement</h3>
          <p class="text-sm text-gray-500 mb-4">Drag and drop your PDF statement here</p>
          <label class="cursor-pointer bg-white border border-gray-300 shadow-sm hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors">
            Browse Files
            <input type="file" accept="application/pdf" class="hidden" @change="handleFileInput" />
          </label>
        </div>
      </div>

      <!-- Expense Table -->
      <ExpenseTable v-if="expenses.length > 0" v-model="expenses" :clients="parsedClientList" />

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import ExpenseTable from './components/ExpenseTable.vue';
import { convertPdfToImageBase64 } from './services/pdfParser';
import { analyzeStatementImages, type ExpenseRecord } from './services/ollamaAgent';
import { exportToExcel } from './services/exportExcel';

const expenses = ref<ExpenseRecord[]>([]);
const isDragging = ref(false);
const isProcessing = ref(false);

const rawClientList = ref("");
const apiKey = ref("");
const companyName = ref("");
const employeeName = ref("");
const designation = ref("");

const parsedClientList = computed(() => {
  if (!rawClientList.value) return [];
  return rawClientList.value.split(',').map(c => c.trim()).filter(c => c.length > 0);
});

onMounted(() => {
  const cachedDraft = localStorage.getItem('expense_tracker_draft');
  if (cachedDraft) { try { expenses.value = JSON.parse(cachedDraft); } catch(e){} }

  const cachedClients = localStorage.getItem('expense_tracker_clients');
  if (cachedClients) rawClientList.value = cachedClients;

  const cachedKey = localStorage.getItem('expense_tracker_api_key');
  if (cachedKey) apiKey.value = cachedKey;

  const cachedCompany = localStorage.getItem('expense_tracker_company');
  if (cachedCompany) companyName.value = cachedCompany;

  const cachedEmp = localStorage.getItem('expense_tracker_emp');
  if (cachedEmp) employeeName.value = cachedEmp;

  const cachedDesig = localStorage.getItem('expense_tracker_desig');
  if (cachedDesig) designation.value = cachedDesig;
});

watch(expenses, (newVal) => {
  if (newVal.length > 0) localStorage.setItem('expense_tracker_draft', JSON.stringify(newVal));
  else localStorage.removeItem('expense_tracker_draft');
}, { deep: true });

watch(rawClientList, (newVal) => localStorage.setItem('expense_tracker_clients', newVal));
watch(apiKey, (newVal) => localStorage.setItem('expense_tracker_api_key', newVal.trim()));
watch(companyName, (newVal) => localStorage.setItem('expense_tracker_company', newVal.trim()));
watch(employeeName, (newVal) => localStorage.setItem('expense_tracker_emp', newVal.trim()));
watch(designation, (newVal) => localStorage.setItem('expense_tracker_desig', newVal.trim()));

const totalSpent = computed(() => expenses.value.filter(item => item.category !== 'excluded').reduce((sum, item) => sum + (Number(item.amount) || 0), 0));
const getCategoryTotal = (category: string) => expenses.value.filter(item => item.category === category).reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

const handleDrop = async (e: DragEvent) => {
  isDragging.value = false;
  if (e.dataTransfer?.files[0]) processFile(e.dataTransfer.files[0]);
};

const handleFileInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files?.[0]) processFile(target.files[0]);
};

const processFile = async (file: File) => {
  if (!apiKey.value || apiKey.value.trim() === '') {
    alert("Please configure your Ollama Cloud API Key in the settings panel above before uploading a statement.");
    return;
  }

  if (file.type !== 'application/pdf') {
    alert("Please upload a PDF file.");
    return;
  }
  
  isProcessing.value = true;
  
  try {
    const base64Images = await convertPdfToImageBase64(file);
    if (base64Images.length === 0) throw new Error("Failed to extract images from the PDF.");
    
    const parsedData = await analyzeStatementImages(base64Images, apiKey.value.trim());
    
    if (parsedData && parsedData.length > 0) {
        expenses.value = parsedData;
    } else {
        alert("The AI model failed to extract any valid expense items. Check console.");
    }
  } catch (error: any) {
    console.error("Processing Error:", error);
    alert(`Failed to process statement: ${error.message || 'Unknown error'}`);
  } finally {
    isProcessing.value = false;
  }
};

const downloadExcel = () => {
  exportToExcel(expenses.value, {
    companyName: companyName.value,
    employeeName: employeeName.value,
    designation: designation.value
  });
};

const clearData = () => { if (confirm("Clear current draft?")) expenses.value = []; };
</script>

<template>
  <div id="app">
    <h1>Трекер финансовых расходов</h1>

    <!-- Секция добавления категорий -->
    <h2>Форма добавления категорий</h2>
    <div class="form-container">
      <label for="name">Название:</label>
      <input id="name" v-model="newCategory.name" type="text" placeholder="Введите название" />

      <button @click="apiAddCategory" :disabled="isSaving">
        {{ isSaving ? 'Сохранение...' : 'Добавить категорию (API)' }}
      </button>
    </div>

    <!-- Секция добавления расходов -->
    <h2>Форма добавления расходов</h2>
    <div class="form-container">
      <label for="sum">Сумма:</label>
      <!-- Используем .number для автоматического преобразования в число -->
      <input id="sum" v-model.number="newExpense.amount" type="number" min="0.01" step="0.01"
        placeholder="Введите сумму" />

      <label for="categoryId">Категория:</label>
      <!-- Ввод ID категории как числа -->
      <input id="categoryId" v-model.number="newExpense.categoryId" type="text" placeholder="Введите ID категории" />

      <label for="description">Описание:</label>
      <input id="description" v-model="newExpense.description" type="text" placeholder="Введите описание" />

      <button @click="apiAddExpense" :disabled="isSaving">
        {{ isSaving ? 'Запись...' : 'Добавить расход (API)' }}
      </button>
    </div>

    <!-- Секция отображения всех расходов -->
    <section class="expense-list-section">
      <h2>Журнал Расходов</h2>
      <div v-if="loadingExpenses" class="status-message">Загрузка расходов...</div>
      <div v-else-if="expenses.length === 0" class="empty-list">
        Расходы пока не добавлены или не загружены.
      </div>
      <ul v-else class="expense-log">
        <li v-for="expense in expenses" :key="expense.id" class="expense-item">
          <!-- Проверяем, что expense.amount существует и является числом -->
          <strong>{{ (+expense.sum || 0).toFixed(2) }} руб.</strong> |
          Категория ID {{ expense.categoryId }} |
          Описание: {{ expense.description || 'Нет описания' }}
        </li>
      </ul>
    </section>

    <!-- Секция отображения категорий для справки -->
    <section class="category-list-section">
      <h2>Категории</h2>
      <div v-if="loadingCategories" class="status-message">Загрузка категорий...</div>
      <ul v-else>
        <li v-for="cat in categories" :key="cat.id">ID: {{ cat.id }} - {{ cat.name }}</li>
      </ul>
    </section>

  </div>
</template>

<script setup>
/* eslint-disable */
import { ref, reactive, computed, onMounted } from 'vue';
import axios from 'axios';

// --- КОНФИГУРАЦИЯ ---
const API_BASE_URL = 'http://localhost:8085/api';
// ---------------------

// --- Состояние форм ---
const newExpense = reactive({
  amount: "", // Используем amount вместо sum для ясности
  categoryId: null,
  description: ''
});

const newCategory = reactive({
  name: '',
});

// --- Состояние данных и загрузки ---
const loadingCategories = ref(false);
const loadingExpenses = ref(false);
const isSaving = ref(false);

const categories = ref([]);
const expenses = ref([]);

// --- ЖИЗНЕННЫЙ ЦИКЛ ---

onMounted(() => {
  fetchCategories();
  fetchExpenses();
  console.log(expenses);
});

// --- МЕТОДЫ API (GET) ---

async function fetchCategories() {
  loadingCategories.value = true;
  try {
    const response = await axios.get(`${API_BASE_URL}/category`);
    // Убедитесь, что response.data - массив, и отфильтруйте null, если это возможно
    categories.value = Array.isArray(response.data.data)
      ? response.data.data.filter(item => item)
      : []; // Если это не массив, устанавливаем пустой массив
  } catch (error) {
    console.error("Ошибка при загрузке категорий:", error);
    categories.value = []; // Устанавливаем пустой массив в случае ошибки
  } finally {
    loadingCategories.value = false;
  }
}

async function fetchExpenses() {
  loadingExpenses.value = true;
  try {
    const response = await axios.get(`${API_BASE_URL}/expense`);

    // Улучшение: Проверяем, что это массив, и фильтруем любые null/undefined элементы
    if (Array.isArray(response.data.data)) {
      // Фильтруем элементы, у которых есть ОБА свойства: id И categoryId, чтобы избежать ошибок при доступе к ним в шаблоне
      expenses.value = response.data.data.filter(item => item && item.id && item.categoryId);
    } else {
      console.warn("Бэкенд вернул не массив для расходов:", response.data.data);
      expenses.value = [];
    }
  } catch (error) {
    console.error("Ошибка при загрузке расходов:", error);
    expenses.value = [];
  } finally {
    loadingExpenses.value = false;
  }
}

// --- МЕТОДЫ API (POST) ---

async function apiAddCategory() {
  if (newCategory.name.trim() === '') {
    alert('Пожалуйста, введите название категории.');
    return;
  }

  isSaving.value = true;
  try {
    const response = await axios.post(`${API_BASE_URL}/category`, {
      name: newCategory.name.trim()
    });

    // Добавляем созданный объект (с ID от сервера) в локальный список
    categories.value.push(response.data);
    newCategory.name = '';
    alert('Категория успешно добавлена!');

  } catch (error) {
    console.error("Ошибка при добавлении категории:", error);
    alert('Ошибка сервера при добавлении категории.');
  } finally {
    isSaving.value = false;
  }
}

async function apiAddExpense() {
  // Валидация: сумма должна быть числом > 0 и категория должна быть указана
  if (newExpense.amount === null || newExpense.amount <= 0 || newExpense.categoryId === null) {
    alert('Пожалуйста, укажите корректную сумму и ID категории.');
    return;
  }

  isSaving.value = true;
  try {
    const expenseData = {
      sum: parseFloat(newExpense.amount),
      categoryName: newExpense.categoryId,
      description: newExpense.description ? newExpense.description.trim() : null
    };
    const response = await axios.post(`${API_BASE_URL}/expense`, expenseData);

    // Добавляем ответ сервера
    expenses.value.push(response.data);

    // Очистка формы
    newExpense.amount = null;
    newExpense.categoryId = null;
    newExpense.description = '';

    alert('Расход успешно записан!');

  } catch (error) {
    console.error("Ошибка при добавлении расхода:", error);
    alert('Ошибка сервера при записи расхода.');
  } finally {
    isSaving.value = false;
  }
}

// --- ВЫЧИСЛЯЕМЫЕ СВОЙСТВА (не использовались в вашем оригинальном коде, но полезны) ---

// const totalExpenses = computed(() => {
//   return expenses.value.reduce((sum, expense) => sum + (expense.amount || 0), 0);
// });

</script>
<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 30px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.expense-list-section {
  text-align: left;
}

.category-list-section {
  text-align: left;
}


label {
  font-weight: bold;
  text-align: left;
}

input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

button:hover {
  background-color: #359669;
}

.user-list {
  list-style: none;
  padding: 0;
  text-align: left;
}

.user-item {
  background: #f9f9f9;
  padding: 10px;
  border-bottom: 1px solid #eee;
  margin-bottom: 5px;
  border-radius: 3px;
}

.empty-list {
  color: #999;
  font-style: italic;
}
</style>
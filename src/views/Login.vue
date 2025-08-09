
<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="login">
      <h2>Login</h2>

      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" type="text" v-model="email" required />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" type="password" v-model="password" required />
      </div>

      <button type="submit">Login</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>



<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/services/api';

    const email = ref('');
    const password = ref('');
    const success = ref('');
    const error = ref('');
    const loading = ref(false);
    const debugInfo = ref(null);
    const router = useRouter();

const login = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  const credentials = {
    "email":email.value,
    "password":password.value,
  }
  try {
    const result = await authAPI.login(credentials)

    console.log("Login response:", result)

    if (result && result.message?.status === 'success') {
      // تخزين بيانات المستخدم
      localStorage.setItem("auth_sid", result.message.sid)
      localStorage.setItem("api_key", result.message.api_key)
      localStorage.setItem("api_secret", result.message.api_secret)
      localStorage.setItem("user_data", JSON.stringify({
        user: result.message.user,
        email: result.message.email,
        user_type: result.message.user_type,
        role:result.message.role
      }))

      success.value = 'تم تسجيل الدخول بنجاح 🎉'

      // التوجيه لصفحة أخرى
      const redirectTo = result.message.redirect_to || '/'
      router.push(redirectTo)
    } else {
      error.value = result?.message?.message || 'فشل تسجيل الدخول'
    }

  } catch (err) {
    console.error(err)
    error.value = 'حدث خطأ أثناء تسجيل الدخول'
  } finally {
    loading.value = false
  }
}

const logout = () => {
  localStorage.clear()
  router.push("/login")
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f8f9fa;
}

.login-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-form h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.3rem;
  font-weight: bold;
  color: #555;
}

.form-group input {
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #007bff;
  outline: none;
}

button[type="submit"] {
  width: 100%;
  padding: 0.7rem;
  background-color: #007bff;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button[type="submit"]:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  margin-top: 1rem;
  text-align: center;
}
</style>

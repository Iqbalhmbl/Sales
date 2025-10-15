<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5>List Sales Orders</h5>
      <button class="btn btn-primary" @click="openAddForm">+ Tambah Sales Order</button>
    </div>

    <table class="table table-bordered table-striped">
      <thead class="table-light">
        <tr>
          <th>No</th>
          <th>Bisnis Unit</th>
          <th>No. SO</th>
          <th>Customer</th>
          <th>Tanggal SO</th>
          <th>Status</th>
          <th>Alasan</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(so, i) in salesOrders" :key="so.id">
          <td>{{ i + 1 }}</td>
          <td>{{ so.bisnis_unit }}</td>
          <td>{{ so.no_so }}</td>
          <td>{{ so.customer }}</td>
          <td>{{ formatDate(so.tanggal_so) }}</td>
          <td>{{ so.status }}</td>
          <td>{{ so.alasan }}</td>
          <td>
            <button class="btn btn-sm btn-success me-1" @click="openEditForm(so.id)">✏️</button>
            <button class="btn btn-sm btn-danger" @click="deleteOrder(so.id)">🗑️</button>
          </td>
        </tr>
        <tr v-if="salesOrders.length === 0">
          <td colspan="8" class="text-center text-muted">Belum ada data</td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Form -->
    <div class="modal fade show d-block" v-if="showModal" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editMode ? 'Edit Sales Order' : 'Tambah Sales Order' }}</h5>
            <button class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <SalesOrderForm :editData="currentData" @saved="refreshList" @close="closeModal" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import SalesOrderForm from './SalesOrderForm.vue'

const salesOrders = ref([])
const showModal = ref(false)
const editMode = ref(false)
const currentData = ref(null)

const fetchSalesOrders = async () => {
  const res = await axios.get('http://localhost:5000/api/sales-orders')
  salesOrders.value = res.data
}

const openAddForm = () => {
  editMode.value = false
  currentData.value = null
  showModal.value = true
}

const openEditForm = async (id) => {
  editMode.value = true
  const res = await axios.get(`http://localhost:5000/api/sales-orders/${id}`)
  currentData.value = res.data
  showModal.value = true
}

const deleteOrder = async (id) => {
  if (confirm('Yakin hapus data ini?')) {
    await axios.delete(`http://localhost:5000/api/sales-orders/${id}`)
    await fetchSalesOrders()
  }
}

const closeModal = () => {
  showModal.value = false
}

const refreshList = async () => {
  closeModal()
  await fetchSalesOrders()
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID')
}

onMounted(fetchSalesOrders)
</script>

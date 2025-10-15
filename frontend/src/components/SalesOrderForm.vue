<template>
  <form @submit.prevent="saveOrder">
    <div class="row mb-3">
      <div class="col-md-4">
        <label>Bisnis Unit</label>
        <input v-model="form.bisnis_unit" class="form-control" required />
      </div>
      <div class="col-md-4">
        <label>No. SO</label>
        <input v-model="form.no_so" class="form-control" required />
      </div>
      <div class="col-md-4">
        <label>Tanggal SO</label>
        <input type="date" v-model="form.tanggal_so" class="form-control" required />
      </div>
    </div>

    <div class="row mb-3">
      <div class="col-md-4">
        <label>Customer</label>
        <input v-model="form.customer" class="form-control" required />
      </div>
      <div class="col-md-4">
        <label>Alasan</label>
        <input v-model="form.alasan" class="form-control" required />
      </div>
      <div class="col-md-4">
        <label>Status</label>
        <select v-model="form.status" class="form-control">
          <option value="DRAFT">DRAFT</option>
          <option value="CLOSED">CLOSED</option>
        </select>
      </div>
    </div>

    <div class="mb-3">
      <label>Catatan</label>
      <textarea v-model="form.catatan" class="form-control"></textarea>
    </div>

    <h6>Sales Order Detail</h6>
    <table class="table table-bordered">
      <thead class="table-light">
        <tr>
          <th>No</th>
          <th>Kode</th>
          <th>Nama Item</th>
          <th>Qty SO</th>
          <th>Qty DO</th>
          <th>Qty Blm Terkirim</th>
          <th>Qty Closing</th>
          <th>Satuan</th>
          <th>Catatan</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(d, i) in form.details" :key="i">
          <td>{{ i + 1 }}</td>
          <td><input v-model="d.kode" class="form-control" /></td>
          <td><input v-model="d.nama_item" class="form-control" /></td>
          <td><input type="number" v-model="d.qty_so" class="form-control" /></td>
          <td><input type="number" v-model="d.qty_do" class="form-control" /></td>
          <td><input type="number" v-model="d.qty_blm_terkirim" class="form-control" /></td>
          <td><input type="number" v-model="d.qty_closing" class="form-control" /></td>
          <td><input v-model="d.satuan" class="form-control" /></td>
          <td><input v-model="d.catatan" class="form-control" /></td>
          <td><button type="button" class="btn btn-danger btn-sm" @click="removeDetail(i)">🗑️</button></td>
        </tr>
      </tbody>
    </table>

    <button type="button" class="btn btn-secondary" @click="addDetail">+ Tambah Item</button>

    <div class="text-end mt-4">
      <button type="button" class="btn btn-outline-secondary me-2" @click="$emit('close')">Batal</button>
      <button type="submit" class="btn btn-success">💾 Simpan</button>
    </div>
  </form>
</template>

<script setup>
import axios from 'axios'
import { reactive, onMounted, watch } from 'vue'

const props = defineProps({
  editData: Object
})
const emit = defineEmits(['saved', 'close'])

const form = reactive({
  bisnis_unit: '',
  no_so: '',
  customer: '',
  tanggal_so: '',
  alasan: '',
  catatan: '',
  status: 'DRAFT',
  details: []
})

const addDetail = () => {
  form.details.push({
    kode: '',
    nama_item: '',
    qty_so: 0,
    qty_do: 0,
    qty_blm_terkirim: 0,
    qty_closing: 0,
    satuan: '',
    catatan: ''
  })
}

const removeDetail = (i) => {
  form.details.splice(i, 1)
}

const saveOrder = async () => {
  try {
    if (props.editData && props.editData.order?.id) {
      await axios.put(`http://localhost:5000/api/sales-orders/${props.editData.order.id}`, form)
    } else {
      await axios.post('http://localhost:5000/api/sales-orders', form)
    }
    alert('Data berhasil disimpan!')
    emit('saved')
  } catch (err) {
    console.error(err)
    alert('Gagal menyimpan data!')
  }
}
watch(
  () => props.editData,
  (val) => {
    if (val && val.order) {
      // Reset dulu form agar data lama hilang
      Object.keys(form).forEach((key) => {
        if (key === 'details') form.details = []
        else form[key] = ''
      })

      // Copy data dari props
      form.bisnis_unit = val.order.bisnis_unit
      form.no_so = val.order.no_so
      form.customer = val.order.customer
      form.tanggal_so = val.order.tanggal_so
      form.alasan = val.order.alasan
      form.catatan = val.order.catatan
      form.status = val.order.status
      form.details = JSON.parse(JSON.stringify(val.details || []))
    } else {
      // Jika tidak ada editData, reset form untuk tambah baru
      Object.keys(form).forEach((key) => {
        if (key === 'details') form.details = []
        else form[key] = ''
      })
      form.status = 'DRAFT'
    }
  },
  { immediate: true, deep: true }
)

</script>

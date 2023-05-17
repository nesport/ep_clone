<template>
  <q-table
    flat bordered title="Пользователи" :rows="usersList" :columns="columns" row-key="name" binary-state-sort
    :pagination="{ rowsPerPage: 10 }"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td v-for="col in columns" :key="col.name" :props="props" :class="{'edit-cell': col.inputType}">
          <span v-if="col.name === 'role'">{{ props.row[col.name].name }}</span>
          <span v-else-if="col.name === 'createdAt'">{{ new Date(props.row[col.name]).toLocaleString("ru-RU") }}</span>
          <span v-else>{{ props.row[col.name] }}</span>
          <q-popup-edit
              v-model="props.row[col.name]" buttons label-set="Сохранить" label-cancel="Отмена" v-if="col.inputType"
              v-slot="scope" @save="save($event, col.name, props.row.id)" :title="col.label"
          >
            <q-input v-model="scope.value" dense autofocus v-if="col.inputType === 'input'" />
            <q-input v-model.number="scope.value" type="number" dense autofocus v-if="col.inputType === 'number'" />
            <q-toggle v-model="scope.value" dense autofocus v-if="col.inputType === 'boolean'" />
            <q-select
                v-model="scope.value" outlined :options="rolesList" autofocus v-if="col.inputType === 'role'"
                option-value="id" option-label="name"
            />
          </q-popup-edit>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup>
import { ref } from 'vue'
definePageMeta({ middleware: 'admin' })

const columns = [
  { name: 'id', label: 'ID', align: 'center', style: 'width: 50px' },
  { name: 'username', label: 'Логин', align: 'left', inputType: 'input' },
  { name: 'email', label: 'Email', align: 'left', inputType: 'input' },
  { name: 'confirmed', label: 'Подтвержден', align: 'center', inputType: 'boolean' },
  { name: 'blocked', label: 'Заблокирован', align: 'center', inputType: 'boolean' },
  { name: 'role', label: 'Роль', align: 'left', inputType: 'role' },
  { name: 'about', label: 'Комментарий', align: 'left', inputType: 'input' },
  { name: 'id_bitrix_personal', label: 'id_bitrix_personal', align: 'center', inputType: 'number' },
  { name: 'id_bitrix_contact', label: 'id_bitrix_contact', align: 'center', inputType: 'number' },
  { name: 'id_telegram', label: 'id_telegram', align: 'center', inputType: 'number' },
  { name: 'createdAt', label: 'Дата создания' }
]
const usersList = ref([])
const rolesList = ref([])

usersList.value = await apiFetch('/api/admin', {
  method: 'GET',
  params: { data: 'users' }
})

rolesList.value = await apiFetch('/api/admin', {
  method: 'GET',
  params: { data: 'roles' }
})

async function save(value, colName, id) {
  if (value === '') value = null
  if (value && value.id) value = value.id
  await apiFetch('/api/admin', {
    method: 'POST',
    body: {
      userId: id,
      field: colName,
      value: value
    }
  })
}

</script>

<style lang="scss" scoped>
  .edit-cell {
    cursor: pointer;
  }
</style>

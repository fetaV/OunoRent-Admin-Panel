import React, { useEffect, useState } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormSelect,
  CFormSwitch,
} from '@coreui/react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import API_BASE_URL from '../../../../config'

const Warehouse = () => {
  const [warehouses, setWarehouses] = useState([])
  const [name, setName] = useState('')
  const [logoWarehouseId, setLogoWarehouseId] = useState(0)
  const [editWarehouseId, setEditWarehouseId] = useState(null)
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(null)
  const [visible, setVisible] = useState(false)
  const [visible2, setVisible2] = useState(false)
  const [isActive, setIsActive] = useState(false)

  const newWarehouse = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API_BASE_URL}/warehouse`, {
        name,
        logoWarehouseId: parseInt(logoWarehouseId, 10),
        isActive,
      })
      setWarehouses([...warehouses, response.data])
      toast.success('Başarıyla Kayıt İşlemi Gerçekleşti!')
      setInterval(() => {
        window.location.reload()
      }, 500)
      setName('')
      setLogoWarehouseId(0)
      setIsActive(false)
      setVisible(false)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${API_BASE_URL}/warehouse`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setWarehouses(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchWarehouses()
  }, [])

  const handleDelete = async (warehouseId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_BASE_URL}/warehouse/${warehouseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setWarehouses(warehouses.filter((warehouse) => warehouse.warehouseId !== warehouseId))
      toast.success('Başarıyla Kayıt Silindi!')
    } catch (error) {
      console.error(error.response.data)
    }
  }

  const warehouseEdit = async (warehouseId) => {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${API_BASE_URL}/warehouse/${warehouseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const warehouseData = response.data

    setEditWarehouseId(warehouseId)
    setName(warehouseData.name || '')
    setLogoWarehouseId(warehouseData.logoWarehouseId || 0)
    setIsActive(warehouseData.isActive || false)
    setVisible2(true)
  }

  const handleEdit = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(
        `${API_BASE_URL}/warehouse/${editWarehouseId}`,
        {
          warehouseId: editWarehouseId,
          name,
          logoWarehouseId: parseInt(logoWarehouseId, 10),
          isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      setWarehouses(
        warehouses.map((warehouse) =>
          warehouse.warehouseId === editWarehouseId ? response.data : warehouse,
        ),
      )
      toast.success('Kanal başarıyla güncellendi!')
      setInterval(() => {
        window.location.reload()
      }, 500)
      setVisible2(false)
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  return (
    <>
      <ToastContainer />
      <CModal
        visible={visible2}
        onClose={() => setVisible2(false)}
        aria-labelledby="LiveDemoExampleLabel2"
      >
        <CModalHeader>
          <CModalTitle>Depo Düzenle</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm className="mt-3">
            <CFormInput
              type="text"
              id="exampleFormControlInput1"
              label="Depo Adı"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <CFormInput
              type="number"
              id="exampleFormControlInput2"
              label="Logo Depo ID"
              value={logoWarehouseId}
              onChange={(e) => setLogoWarehouseId(e.target.value)}
            />
            <CFormSwitch
              id="isActive"
              label="Aktif"
              className="mt-3"
              checked={isActive}
              onChange={() => setIsActive(!isActive)}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible2(false)}>
            Kapat
          </CButton>
          <CButton color="primary" onClick={handleEdit}>
            Değişiklikleri Kaydet
          </CButton>
        </CModalFooter>
      </CModal>

      <CButton color="primary" className="mb-3" onClick={() => setVisible(!visible)}>
        Yeni Depo Ekle
      </CButton>
      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel">Yeni Depo Ekle</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm className="mt-3">
            <CFormInput
              type="text"
              id="exampleFormControlInput1"
              label="Depo Adı"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <CFormInput
              type="number"
              id="exampleFormControlInput2"
              label="Logo Depo ID"
              value={logoWarehouseId}
              onChange={(e) => setLogoWarehouseId(e.target.value)}
            />
            <CFormSwitch
              id="isActive"
              label="Aktif"
              className="mt-3"
              checked={isActive}
              onChange={() => setIsActive(!isActive)}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={newWarehouse}>
            Kaydet
          </CButton>
        </CModalFooter>
      </CModal>

      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Depo Adı
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Eylemler
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {warehouses.map((warehouse, index) => (
            <CTableRow key={index}>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {warehouse.name}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                <CButton
                  color="primary"
                  className="me-2"
                  onClick={() => warehouseEdit(warehouse.warehouseId)}
                >
                  Düzenle
                </CButton>
                <CButton
                  color="danger text-white"
                  className="me-2"
                  onClick={() => handleDelete(warehouse.warehouseId)}
                >
                  Sil
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </>
  )
}

export default Warehouse

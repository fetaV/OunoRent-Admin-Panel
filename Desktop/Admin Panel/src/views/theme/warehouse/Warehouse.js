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
  CFormSwitch,
  CPagination,
  CPaginationItem,
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
  const [visible, setVisible] = useState(false)
  const [visible2, setVisible2] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredWarehouse, setFilteredWarehouse] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const sortedWarehouses = warehouses.sort((a, b) => {
    if (a.isActive === b.isActive) {
      return 0
    } else if (a.isActive && !b.isActive) {
      return -1
    } else {
      return 1
    }
  })

  const newWarehouse = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API_BASE_URL}/warehouse`, {
        name,
        logoWarehouseId: parseInt(logoWarehouseId, 10),
        isActive,
      })
      setWarehouses([...warehouses, response.data])
      setFilteredWarehouse([...warehouses, response.data])
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
    const lowercasedQuery = searchQuery.toLowerCase()
    const filteredData = warehouses
      .filter((warehouses) => warehouses.name?.toLowerCase().includes(lowercasedQuery))
      .sort((a, b) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1))
    setFilteredWarehouse(filteredData)
  }, [searchQuery, warehouses])

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${API_BASE_URL}/warehouse`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log('data', response.data)
        setWarehouses(response.data)
        setFilteredWarehouse(response.data)
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
      setFilteredWarehouse(warehouses.filter((warehouse) => warehouse.warehouseId !== warehouseId))
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
    console.log('id', warehouseData)

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
      setFilteredWarehouse(
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

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredWarehouse.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredWarehouse.length / itemsPerPage)
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
              label={isActive ? 'Aktif' : 'Pasif'}
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
              label={isActive ? 'Aktif' : 'Pasif'}
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
      <CFormInput
        type="text"
        id="search"
        placeholder="Arama"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Depo Adı
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Durum
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Eylemler
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentItems.map((warehouse, index) => (
            <CTableRow key={index}>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {warehouse.name}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    backgroundColor: warehouse.isActive ? '#d4edda' : '#f8d7da',
                    color: warehouse.isActive ? '#155724' : '#721c24',
                    border: `1px solid ${warehouse.isActive ? '#c3e6cb' : '#f5c6cb'}`,
                  }}
                >
                  {warehouse.isActive ? 'Aktif' : 'Pasif'}
                </div>
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
      <CPagination
        aria-label="Page navigation"
        className="mt-3 btn border-0"
        align="center"
        items={totalPages}
        active={currentPage}
        onChange={(page) => setCurrentPage(page)}
      >
        {[...Array(totalPages).keys()].map((page) => (
          <CPaginationItem
            key={page + 1}
            active={page + 1 === currentPage}
            onClick={() => setCurrentPage(page + 1)}
          >
            {page + 1}
          </CPaginationItem>
        ))}
      </CPagination>
    </>
  )
}

export default Warehouse

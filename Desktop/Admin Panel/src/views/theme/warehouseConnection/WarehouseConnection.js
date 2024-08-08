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
  CFormSelect,
  CFormTextarea,
  CRow,
  CCol,
} from '@coreui/react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import API_BASE_URL from '../../../../config'

function WarehouseConnection() {
  const [warehouseConnection, setwarehouseConnection] = useState([])
  const [isActive, setIsActive] = useState(false)
  const [editWareHouseConnectionId, setEditWareHouseConnectionId] = useState(null)
  const [warehouse, setWarehouse] = useState([])
  const [channel, setChannel] = useState([])
  const [visible, setVisible] = useState(false)
  const [visible2, setVisible2] = useState(false)
  const [selectedChannelId, setSelectedChannelId] = useState('')
  const [selectedWarehouse, setSelectedWarehouse] = useState('')
  const [editwarehouseConnectionData, setEditwarehouseConnectionData] = useState({
    warehouseConnectionId: '',
    warehouse: '',
    title: '',
    largeImageg: '',
    smallImage: '',
    tags: '',
    slug: '',
    orderNumber: 0,
    date: '',
    isActive: false,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = {
      warehouseId: selectedWarehouse,
      channelId: selectedChannelId,
      isActive,
    }

    try {
      await axios.post(`${API_BASE_URL}/warehouseConnection`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      toast.success('warehouseConnection başarıyla eklendi!')
      setInterval(() => {
        window.location.reload()
      }, 500)
      setVisible(false)
      setSelectedChannelId('')
      setSelectedWarehouse('')
      setIsActive(false)
    } catch (error) {
      console.error(error)
      toast.error('warehouseConnection eklenirken bir hata oluştu!')
    }
  }

  useEffect(() => {
    const fetchwarehouseConnection = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${API_BASE_URL}/warehouseConnection`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log(response.data)
        setwarehouseConnection(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchwarehouseConnection()
  }, [])

  const fetchWarehouse = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE_URL}/warehouse`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('warehouse:', response.data) / setWarehouse(response.data)
    } catch (error) {
      console.error(
        'Error fetching warehouse:',
        error.response ? error.response.data : error.message,
      )
    }
  }

  const fetchChannel = async (channelId) => {
    try {
      console.log('Fetching channel for channelId:', channelId)
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE_URL}/channel`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('channel response:', response.data)
      setChannel(response.data)
    } catch (error) {
      console.error('Error fetching channel:', error.response ? error.response.data : error.message)
    }
  }

  useEffect(() => {
    fetchWarehouse()
    fetchChannel(selectedChannelId)
  }, [])

  const handlechannelChange = (event) => {
    const selectedId = event.target.value
    setSelectedChannelId(selectedId)
    fetchChannel(selectedId)
  }
  const handlewarehouseChange = (event) => {
    const selectedId = event.target.value
    setSelectedWarehouse(selectedId)
    console.log(selectedId)
  }

  const handleDelete = async (warehouseConnectionId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_BASE_URL}/warehouseConnection/${warehouseConnectionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setwarehouseConnection(
        warehouseConnection.filter(
          (warehouseConnection) =>
            warehouseConnection.warehouseConnectionId !== warehouseConnectionId,
        ),
      )
      toast.success('warehouseConnection başarıyla silindi!')
    } catch (error) {
      console.error(error.response.data)
      toast.error('warehouseConnection silinirken bir hata oluştu!')
    }
  }

  const handleEditModalOpen = async (warehouseConnectionId) => {
    const token = localStorage.getItem('token')
    const response = await axios.get(
      `${API_BASE_URL}/warehouseConnection/${warehouseConnectionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    console.log('idwarehouseConnection', response)

    const warehouseConnectionData = response.data
    setEditWareHouseConnectionId(warehouseConnectionId)
    setEditwarehouseConnectionData(warehouseConnectionData)
    setSelectedWarehouse(warehouseConnectionData.warehouseName || '')
    setSelectedChannelId(warehouseConnectionData.channelId || '')
    setIsActive(warehouseConnectionData.isActive || false)
    setVisible2(true)
  }

  const handleEdit = async (warehouseConnectionId) => {
    const formData = {
      warehouseConnectionId,
      warehouseId: selectedWarehouse,
      channelId: selectedChannelId,
      isActive,
    }

    try {
      const token = localStorage.getItem('token')
      await axios.put(`${API_BASE_URL}/warehouseConnection/${warehouseConnectionId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      toast.success('warehouseConnection başarıyla güncellendi!')
      setInterval(() => {
        window.location.reload()
      }, 500)
      setVisible2(false)
    } catch (error) {
      console.error('Error response:', error.response)
      if (error.response && error.response.status === 409) {
        toast.error('Çakışma: warehouseConnection ID zaten mevcut veya veri çakışması yaşandı.')
      } else {
        toast.error('warehouseConnection güncellenirken hata oluştu.')
      }
    }
  }

  return (
    <>
      <ToastContainer />
      <CButton color="primary" className="mb-3" onClick={() => setVisible(true)}>
        Yeni warehouseConnection Ekle
      </CButton>

      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel">Yeni warehouseConnection Ekle</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormSelect
              label="Depo"
              className="mb-3"
              aria-label="Select warehouse"
              onChange={handlewarehouseChange}
              value={selectedWarehouse}
            >
              <option value="">Depo Seçiniz</option>
              {warehouse.map((warehouse) => (
                <option key={warehouse.warehouseId} value={warehouse.warehouseId}>
                  {warehouse.name}
                </option>
              ))}
            </CFormSelect>

            <CFormSelect
              label="Kanal"
              className="mb-3"
              aria-label="Select channel"
              onChange={handlechannelChange}
              value={selectedChannelId}
            >
              <option value="">Kanal Seçiniz</option>
              {channel.map((channel) => (
                <option key={channel.channelId} value={channel.channelId}>
                  {channel.name}
                </option>
              ))}
            </CFormSelect>

            <CFormSwitch
              id="isActive"
              label={isActive ? 'Aktif' : 'Pasif'}
              className="mb-3"
              checked={isActive}
              onChange={() => setIsActive(!isActive)}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Kapat
          </CButton>
          <CButton color="primary" onClick={handleSubmit}>
            Kaydet
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        visible={visible2}
        onClose={() => setVisible2(false)}
        aria-labelledby="LiveDemoExampleLabel2"
      >
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel2">warehouseConnection Düzenle</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormSelect
              label="Depo"
              className="mb-3"
              aria-label="Select warehouse"
              onChange={handlewarehouseChange}
              value={selectedWarehouse}
            >
              <option value="">Depo Seçiniz</option>
              {warehouse.map((warehouse) => (
                <option key={warehouse.warehouseId} value={warehouse.warehouseId}>
                  {warehouse.name}
                </option>
              ))}
            </CFormSelect>

            <CFormSelect
              label="Kanal"
              className="mb-3"
              aria-label="Select channel"
              onChange={handlechannelChange}
              value={selectedChannelId}
            >
              <option value="">Kanal Seçiniz</option>
              {channel.map((channel) => (
                <option key={channel.channelId} value={channel.channelId}>
                  {channel.name}
                </option>
              ))}
            </CFormSelect>

            <CFormSwitch
              id="isActive"
              label={isActive ? 'Aktif' : 'Pasif'}
              className="mb-3"
              checked={isActive}
              onChange={() => setIsActive(!isActive)}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible2(false)}>
            Kapat
          </CButton>
          <CButton color="primary" onClick={() => handleEdit(editWareHouseConnectionId)}>
            Değişiklikleri Kaydet
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
              Kanal Adı
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
          {warehouseConnection.map((warehouseConnection) => (
            <CTableRow key={warehouseConnection.warehouseConnectionId}>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {warehouseConnection.warehouseName}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {warehouseConnection.channelName}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {warehouseConnection.isActive ? 'Aktif' : 'Pasif'}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                <CButton
                  color="primary"
                  className="me-2"
                  onClick={() => handleEditModalOpen(warehouseConnection.warehouseConnectionId)}
                >
                  Düzenle
                </CButton>
                <CButton
                  color="danger text-white"
                  onClick={() => handleDelete(warehouseConnection.warehouseConnectionId)}
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

export default WarehouseConnection

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

const WarehouseConnection = () => {
  const [warehouse, setWarehouse] = useState([])
  const [channels, setchannels] = useState([])
  const [orderNumber, setOrderNumber] = useState('')
  const [editchannelId, setEditchannelId] = useState(null)
  const [selectedChannelId, setSelectedChannelId] = useState(null)
  const [visible, setVisible] = useState(false)
  const [visible2, setVisible2] = useState(false)
  const [isActive, setIsActive] = useState(false)

  const newchannel = async (e) => {
    console.log('Sending request with data:', {
      channelId: selectedChannelId,
      orderNumber: parseInt(orderNumber, 10),
      isActive,
    })
    e.preventDefault()
    try {
      const response = await axios.post(`${API_BASE_URL}/channel`, {
        channelId: selectedChannelId,
        orderNumber: parseInt(orderNumber, 10),
        isActive,
      })
      setWarehouse([...warehouse, response.data])
      toast.success('Başarıyla Kayıt İşlemi Gerçekleşti!')
      setInterval(() => {
        window.location.reload()
      }, 500)
      setOrderNumber('')
      setVisible(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handlechannelChange = (event) => {
    const selectedId = event.target.value
    setSelectedChannelId(selectedId)
  }

  useEffect(() => {
    const fetchchannels = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${API_BASE_URL}/warehouseconnection`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log('channel', response)
        setchannels(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchchannels()
  }, [])

  useEffect(() => {
    const fetchwarehouse = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${API_BASE_URL}/channel`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log('channel', response)
        setWarehouse(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchwarehouse()
  }, [])

  const handleDelete = async (channelId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_BASE_URL}/channel/${channelId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setWarehouse(warehouse.filter((channel) => channel.channelId !== channelId))
      toast.success('Başarıyla Kayıt Silindi!')
    } catch (error) {
      console.error(error.response.data)
    }
  }

  const channelEdit = async (channelId) => {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${API_BASE_URL}/channel/${channelId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const channelData = response.data

    setEditchannelId(channelId)
    setSelectedChannelId(channelData.channelId || '')
    setOrderNumber(channelData.orderNumber || '')
    setIsActive(channelData.isActive || false)
    setVisible2(true)
  }

  const handleEdit = async () => {
    console.log({
      channelId: editchannelId,
      channelId: selectedChannelId,
      orderNumber: parseInt(orderNumber, 10),
      isActive,
    })
    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(
        `${API_BASE_URL}/channel/${editchannelId}`,
        {
          channelId: editchannelId,
          channelId: selectedChannelId,
          orderNumber: parseInt(orderNumber, 10),
          isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      setWarehouse(
        warehouse.map((channel) => (channel.channelId === editchannelId ? response.data : channel)),
      )
      toast.success('Kanal başarıyla güncellendi!')
      setInterval(() => {
        window.location.reload()
      }, 500)
      setVisible2(false) // Edit modalı kapat
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
          <CFormSelect
            label="Kanal"
            className="mb-3"
            aria-label="Select channel"
            onChange={handlechannelChange}
            value={selectedChannelId}
          >
            <option value="">Kanal Seçiniz</option>
            {channels.map((channel) => (
              <option key={channel.channelId} value={channel.channelId}>
                {channel.name}
              </option>
            ))}
          </CFormSelect>

          <CForm className="mt-3">
            <CFormInput
              type="text"
              id="exampleFormControlInput1"
              label="Sıra No"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible2(false)}>
            Kapat
          </CButton>
          <CButton color="primary" onClick={() => handleEdit(editchannelId)}>
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
          <CModalTitle id="LiveDemoExampleLabel">Yeni Kanal Ekle</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormSelect
            label="Kanal"
            className="mb-3"
            aria-label="Select channel"
            onChange={handlechannelChange}
            value={selectedChannelId || ''}
          >
            <option value="">Kanal Seçiniz</option>
            {channels.map((channel) => (
              <option key={channel.channelId} value={channel.channelId}>
                {channel.name}
              </option>
            ))}
          </CFormSelect>

          <CForm className="mt-3">
            <CFormInput
              type="number"
              id="exampleFormControlInput1"
              label="Sıra No"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />
          </CForm>
          <CFormSwitch
            id="isActive"
            label="Aktif"
            className="mt-3"
            checked={isActive}
            onChange={() => setIsActive(!isActive)}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={newchannel}>
            Kaydet
          </CButton>
        </CModalFooter>
      </CModal>

      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Kanal Adı
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Eylemler
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {warehouse.map((warehouse, index) => (
            <CTableRow key={index}>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {warehouse.name}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                <CButton
                  color="primary"
                  className="me-2"
                  onClick={() => channelEdit(warehouse.warehouseId)}
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

export default WarehouseConnection

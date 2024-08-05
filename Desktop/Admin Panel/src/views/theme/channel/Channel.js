import React, { useState, useEffect } from 'react'
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
  CFormTextarea,
} from '@coreui/react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import API_BASE_URL from '../../../../config'

const Channel = () => {
  const [channel, setChannel] = useState([])
  const [currentChannel, setCurrentChannel] = useState(null)
  const [newChannel, setNewChannel] = useState({
    name: '',
    text: '',
    orderNumber: 0,
    isActive: false,
  })
  const [visible, setVisible] = useState(false)
  const [logoFile, setLogoFile] = useState(null)

  useEffect(() => {
    fetchChannel()
  }, [])

  const fetchChannel = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Channel`)
      setChannel(response.data)
    } catch (error) {
      console.error('getChannel error:', error)
      toast.error('Failed to fetch channel items')
    }
  }

  const handleCreateChannel = async () => {
    const formData = new FormData()
    formData.append('Name', newChannel.name)
    formData.append('Logo', logoFile)
    formData.append('IsActive', newChannel.isActive)

    try {
      const response = await axios.post(`${API_BASE_URL}/Channel`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.success('Channel item created successfully')
      fetchChannel()
      setVisible(false)
    } catch (error) {
      console.error('createChannel error:', error)
      toast.error('Failed to create channel item')
    }
  }

  const handleUpdateChannel = async (channelId) => {
    const formData = new FormData()
    formData.append('ChannelId', channelId)
    formData.append('Name', currentChannel.name)
    if (logoFile) {
      formData.append('Logo', logoFile)
    }
    formData.append('IsActive', currentChannel.isActive)
    console.log(currentChannel.name, logoFile, currentChannel.isActive)

    try {
      await axios.put(`${API_BASE_URL}/Channel/${channelId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.success('Channel item updated successfully')
      fetchChannel()
      setVisible(false)
    } catch (error) {
      console.error('updateChannel error:', error)
      toast.error('Failed to update channel item')
    }
  }

  const handleDeleteChannel = async (channelId) => {
    try {
      await axios.delete(`${API_BASE_URL}/Channel/${channelId}`)
      toast.success('Channel item deleted successfully')
      fetchChannel()
    } catch (error) {
      console.error('deleteChannel error:', error)
      toast.error('Failed to delete channel item')
    }
  }

  const handleEditButtonClick = async (channelId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Channel/${channelId}`)
      setCurrentChannel(response.data)
      setVisible(true)
    } catch (error) {
      console.error('Error fetching the channel item:', error)
      toast.error('Failed to fetch channel item')
    }
  }

  return (
    <div>
      <ToastContainer />
      <CButton color="primary" className="mb-3" onClick={() => setVisible(true)}>
        Yeni Channel Ekle
      </CButton>

      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">Soru Başlığı</CTableHeaderCell>
            <CTableHeaderCell scope="col">Sıra Numarası</CTableHeaderCell>
            <CTableHeaderCell scope="col">Durum</CTableHeaderCell>
            <CTableHeaderCell scope="col">Eylemler</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {channel.map((item) => (
            <CTableRow key={item.channelId}>
              <CTableDataCell>{item.name}</CTableDataCell>
              <CTableDataCell>{item.logo}</CTableDataCell>
              <CTableDataCell>{item.isActive ? 'Aktif' : 'Pasif'}</CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="primary text-white"
                  className="me-2"
                  onClick={() => handleEditButtonClick(item.channelId)}
                >
                  Düzenle
                </CButton>
                <CButton
                  color="danger text-white"
                  onClick={() => handleDeleteChannel(item.channelId)}
                >
                  Sil
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>{currentChannel ? 'Edit Channel Item' : 'Create Channel Item'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              className="mb-3"
              label="Soru Başlığı"
              value={currentChannel ? currentChannel.name : newChannel.name}
              onChange={(e) =>
                currentChannel
                  ? setCurrentChannel({ ...currentChannel, name: e.target.value })
                  : setNewChannel({ ...newChannel, name: e.target.value })
              }
            />
            <CFormInput
              type="file"
              className="mb-3"
              label="Logo"
              onChange={(e) => setLogoFile(e.target.files[0])}
            />
            <CFormSwitch
              label="Durum"
              checked={currentChannel ? currentChannel.isActive : newChannel.isActive}
              onChange={(e) =>
                currentChannel
                  ? setCurrentChannel({ ...currentChannel, isActive: e.target.checked })
                  : setNewChannel({ ...newChannel, isActive: e.target.checked })
              }
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Kapat
          </CButton>
          <CButton
            color="primary"
            onClick={() =>
              currentChannel ? handleUpdateChannel(currentChannel.channelId) : handleCreateChannel()
            }
          >
            {currentChannel ? 'Save Changes' : 'Create'}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Channel

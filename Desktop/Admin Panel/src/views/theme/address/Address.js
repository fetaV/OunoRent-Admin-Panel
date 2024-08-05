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
  CRow,
  CCol,
} from '@coreui/react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import API_BASE_URL from '../../../../config'

function Address() {
  const [address, setAddress] = useState([])
  const [addressName, setaddressName] = useState('')
  const [addressType, setaddressType] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [editaddressId, setEditaddressId] = useState(null)
  const [visible2, setVisible2] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('')
  const [editAddressData, setEditAddressData] = useState({
    addressId: '',
    addressName: '',
    tags: '',
    slug: '',
    orderNumber: 0,
    date: '',
    isActive: false,
  })

  useEffect(() => {
    const fetchaddress = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${API_BASE_URL}/address`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log(response)
        setAddress(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchaddress()
  }, [])

  const handleDelete = async (addressId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_BASE_URL}/address/${addressId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setAddress(address.filter((address) => address.addressId !== addressId))
      toast.success('address başarıyla silindi!')
    } catch (error) {
      console.error(error.response.data)
      toast.error('address silinirken bir hata oluştu!')
    }
  }

  const handleEditModalOpen = async (addressId) => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${API_BASE_URL}/address/${addressId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log(response)
      const addressData = response.data
      setEditaddressId(addressId)
      setEditAddressData({
        addressId: addressId,
        addressName: addressData.title || '',
        city: addressData.city || '',
        district: addressData.district || '',
        neighborhood: addressData.neighborhood || '',
        addressDetail: addressData.addressDetail || '',
        taxNo: addressData.taxNo || 0,
        taxOffice: addressData.taxOffice || '',
        companyName: addressData.companyName || '',
        userId: addressData.user.userId || '', // userId'yi doğru şekilde ayarlayın
        isActive: addressData.isActive || false,
      })
      setaddressName(addressData.title || '')
      setaddressType(addressData.type || 0)
      setIsActive(addressData.isActive || false)
      setSelectedSubCategoryId(addressData.neighborhood || '')
      setSelectedCategoryId(addressData.district || '')
      setVisible2(true)
    } catch (error) {
      console.error('Error fetching address:', error)
    }
  }

  const handleEdit = async () => {
    const updatedAddressData = {
      addressId: editAddressData.addressId,
      type: addressType,
      title: addressName,
      city: editAddressData.city,
      district: editAddressData.district,
      neighborhood: editAddressData.neighborhood,
      addressDetail: editAddressData.addressDetail,
      taxNo: editAddressData.taxNo,
      taxOffice: editAddressData.taxOffice,
      companyName: editAddressData.companyName,
      userId: editAddressData.userId,
      isActive: isActive,
    }

    try {
      const token = localStorage.getItem('token')
      await axios.put(`${API_BASE_URL}/address/${editaddressId}`, updatedAddressData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      toast.success('Adres başarıyla güncellendi!')
      setInterval(() => {
        window.location.reload()
      }, 500)
      setVisible2(false)
      setAddress((prevAddresses) =>
        prevAddresses.map((addr) =>
          addr.addressId === editaddressId ? { ...addr, ...updatedAddressData } : addr,
        ),
      )
    } catch (error) {
      console.error('Error response:', error.response)
      if (error.response && error.response.status === 409) {
        toast.error('Çakışma: adres ID zaten mevcut veya veri çakışması yaşandı.')
      } else {
        toast.error('Adres güncellenirken hata oluştu.')
      }
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
          <CModalTitle id="LiveDemoExampleLabel2">Adres Düzenle</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              id="title"
              label="Başlık"
              value={addressName}
              onChange={(e) => setaddressName(e.target.value)}
            />
            <CFormInput
              type="number"
              id="type"
              label="Adres Tipi"
              value={addressType}
              onChange={(e) => setaddressType(e.target.value)}
            />
            <CFormInput
              type="text"
              id="city"
              label="Şehir"
              value={editAddressData.city}
              onChange={(e) => setEditAddressData({ ...editAddressData, city: e.target.value })}
            />
            <CFormInput
              type="text"
              id="district"
              label="İlçe"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            />
            <CFormInput
              type="text"
              id="neighborhood"
              label="Semt"
              value={selectedSubCategoryId}
              onChange={(e) => setSelectedSubCategoryId(e.target.value)}
            />
            <CFormInput
              type="text"
              id="addressDetail"
              label="Adres Detayı"
              value={editAddressData.addressDetail}
              onChange={(e) =>
                setEditAddressData({ ...editAddressData, addressDetail: e.target.value })
              }
            />
            <CFormInput
              type="number"
              id="taxNo"
              label="Vergi No"
              value={editAddressData.taxNo}
              onChange={(e) => setEditAddressData({ ...editAddressData, taxNo: e.target.value })}
            />
            <CFormInput
              type="text"
              id="taxOffice"
              label="Vergi Dairesi"
              value={editAddressData.taxOffice}
              onChange={(e) =>
                setEditAddressData({ ...editAddressData, taxOffice: e.target.value })
              }
            />
            <CFormInput
              type="text"
              id="companyName"
              label="Şirket Adı"
              value={editAddressData.companyName}
              onChange={(e) =>
                setEditAddressData({ ...editAddressData, companyName: e.target.value })
              }
            />
            <CFormSwitch
              id="isActive"
              label="Aktif"
              checked={isActive}
              onChange={() => setIsActive(!isActive)}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible2(false)}>
            Kapat
          </CButton>
          <CButton color="primary" onClick={() => handleEdit(editaddressId)}>
            Değişiklikleri Kaydet
          </CButton>
        </CModalFooter>
      </CModal>

      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">Adres Başlığı</CTableHeaderCell>
            <CTableHeaderCell scope="col">Adres</CTableHeaderCell>
            <CTableHeaderCell scope="col">Şehir</CTableHeaderCell>
            <CTableHeaderCell scope="col">Şirket Adı</CTableHeaderCell>
            <CTableHeaderCell scope="col">İlçe</CTableHeaderCell>
            <CTableHeaderCell scope="col">Semt</CTableHeaderCell>
            <CTableHeaderCell scope="col">Vergi No</CTableHeaderCell>
            <CTableHeaderCell scope="col">Vergi Dairesi</CTableHeaderCell>
            <CTableHeaderCell scope="col">Adres Tipi</CTableHeaderCell>
            <CTableHeaderCell scope="col">Kullanıcı Adı</CTableHeaderCell>
            <CTableHeaderCell scope="col">Durum</CTableHeaderCell>
            <CTableHeaderCell scope="col">Eylemler</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {address.map((address) => (
            <CTableRow key={address.addressId}>
              <CTableDataCell>{address.title}</CTableDataCell>
              <CTableDataCell>{address.addressDetail}</CTableDataCell>
              <CTableDataCell>{address.city}</CTableDataCell>
              <CTableDataCell>{address.companyName}</CTableDataCell>
              <CTableDataCell>{address.district}</CTableDataCell>
              <CTableDataCell>{address.neighborhood}</CTableDataCell>
              <CTableDataCell>{address.taxNo}</CTableDataCell>
              <CTableDataCell>{address.taxOffice}</CTableDataCell>
              <CTableDataCell>{address.type ? 'Kurumsal' : 'Bireysel'}</CTableDataCell>
              <CTableDataCell>{address.user.name}</CTableDataCell>
              <CTableDataCell>{address.isActive ? 'Aktif' : 'Pasif'}</CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="primary"
                  className="me-2"
                  onClick={() => handleEditModalOpen(address.addressId)}
                >
                  Düzenle
                </CButton>
                <CButton color="danger text-white" onClick={() => handleDelete(address.addressId)}>
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

export default Address

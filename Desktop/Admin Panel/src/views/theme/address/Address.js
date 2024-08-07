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
  const [addressName, setAddressName] = useState('')
  const [addressType, setAddressType] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [editAddressId, setEditAddressId] = useState(null)
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
      setEditAddressId(addressId)
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
      setAddressName(addressData.title || '')
      setAddressType(addressData.type || 0)
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
      await axios.put(`${API_BASE_URL}/address/${editAddressId}`, updatedAddressData, {
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
          addr.addressId === editAddressId ? { ...addr, ...updatedAddressData } : addr,
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
              onChange={(e) => setAddressName(e.target.value)}
            />
            <CFormInput
              type="number"
              id="type"
              label="Adres Tipi"
              value={addressType}
              onChange={(e) => setAddressType(e.target.value)}
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
          <CButton color="primary" onClick={() => handleEdit(editAddressId)}>
            Değişiklikleri Kaydet
          </CButton>
        </CModalFooter>
      </CModal>

      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Adres Başlığı
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Adres
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Şehir
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Şirket Adı
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              İlçe
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Semt
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Vergi No
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Vergi Dairesi
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Adres Tipi
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Kullanıcı Adı
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
          {address.map((address) => (
            <CTableRow key={address.addressId}>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {address.title}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {address.addressDetail}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {address.city}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {address.companyName}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {address.district}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {address.neighborhood}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {address.taxNo}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {address.taxOffice}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {address.type ? 'Kurumsal' : 'Bireysel'}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {address.user.name}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {address.isActive ? 'Aktif' : 'Pasif'}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
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

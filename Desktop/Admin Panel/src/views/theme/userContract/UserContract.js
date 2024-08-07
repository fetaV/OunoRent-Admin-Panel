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
} from '@coreui/react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import API_BASE_URL from '../../../../config'

function UserContract() {
  const [userContracts, setUserContracts] = useState([])
  const [userContractName, setUserContractName] = useState('')
  const [userContractType, setUserContractType] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [edituserContractId, setEditUserContractId] = useState(null)
  const [visible, setVisible] = useState(false)
  const [editUserContractData, setEditUserContractData] = useState({
    userContractId: '',
    subCategoryId: '',
    userContractName: '',
    largeImagegUrl: '',
    smallImageUrl: '',
    tags: '',
    slug: '',
    orderNumber: 0,
    date: '',
    isActive: false,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${API_BASE_URL}/userContract`, {
        userContractName,
        userContractType,
        isActive,
      })
      toast.success('userContract başarıyla eklendi!')
      setInterval(() => {
        window.location.reload()
      }, 500)
      setVisible(false)
    } catch (error) {
      console.error(error)
      toast.error('Failed to add Slider')
    }
  }

  useEffect(() => {
    const fetchuserContracts = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${API_BASE_URL}/userContract`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log(response.data)
        setUserContracts(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchuserContracts()
  }, [])

  const handleDelete = async (userContractId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_BASE_URL}/userContract/${userContractId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUserContracts(
        userContracts.filter((userContract) => userContract.userContractId !== userContractId),
      )
      toast.success('userContract başarıyla silindi!')
    } catch (error) {
      console.error(error.response.data)
      toast.error('userContract silinirken bir hata oluştu!')
    }
  }

  const handleEditModalOpen = async (userContractId) => {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${API_BASE_URL}/userContract/${userContractId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log(response)
    const userContractData = response.data
    setEditUserContractId(userContractId)
    setEditUserContractData(userContractData)
    setUserContractName(userContractData.userContractName || '')
    setUserContractType(userContractData.userContractType || '')
    setIsActive(userContractData.isActive || false)
    setVisible(true)
  }

  return (
    <>
      <ToastContainer />

      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="LiveDemoExampleLabel2"
      >
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel2">User Contract Detayları</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              id="fileName"
              label="Dosya Adı"
              value={editUserContractData.fileName || ''}
              readOnly
            />
            <CFormInput
              type="text"
              id="contractName"
              label="Kontrat Adı"
              value={editUserContractData.contract?.name || ''}
              readOnly
            />
            <CFormInput
              type="text"
              id="contractDetails"
              label="Kontrat İçeriği"
              value={editUserContractData.contract?.body || ''}
              readOnly
            />
            <CFormInput
              type="text"
              id="contractVersion"
              label="Kontrat Versiyonu"
              value={editUserContractData.contract?.version || ''}
              readOnly
            />
            <CFormInput
              type="text"
              id="userName"
              label="Kullanıcı Adı"
              value={editUserContractData.user?.name || ''}
              readOnly
            />
            <CFormInput
              type="text"
              id="userEmail"
              label="Kullanıcı E-Posta"
              value={editUserContractData.user?.email || ''}
              readOnly
            />
            <CFormInput
              type="text"
              id="userPhoneNumber"
              label="Kullanıcı Telefon Numarası"
              value={editUserContractData.user?.phoneNumber || ''}
              readOnly
            />
            <CFormSwitch
              id="isActive"
              label="Aktif"
              checked={editUserContractData.isActive || false}
              readOnly
              disabled
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Kapat
          </CButton>
        </CModalFooter>
      </CModal>

      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Kontrat Adı
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Kontrat Versiyonu
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Kullanıcı Adı
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Dosya Adı
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Eylemler
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {userContracts.map((userContract) => (
            <CTableRow key={userContract.userContractId}>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {userContract.contract.name}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {userContract.contract.version}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {userContract.user.name}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {userContract.fileName}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                <CButton
                  color="primary"
                  className="me-2"
                  onClick={() => handleEditModalOpen(userContract.userContractId)}
                >
                  Düzenle
                </CButton>
                <CButton
                  color="danger text-white"
                  onClick={() => handleDelete(userContract.userContractId)}
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

export default UserContract

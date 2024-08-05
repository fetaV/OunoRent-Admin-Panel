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
} from '@coreui/react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import API_BASE_URL from '../../../../config'

const Contract = () => {
  const [contracts, setContracts] = useState([])
  const [currentContract, setCurrentContract] = useState(null)
  const [newContract, setNewContract] = useState({
    name: '',
    version: 0,
    previousVersion: 0,
    body: '',
    type: 0,
    createDate: new Date().toISOString(),
    requiresAt: '',
    isActive: false,
  })
  const [visible, setVisible] = useState(false)
  const [isReadOnly, setIsReadOnly] = useState(false)

  useEffect(() => {
    fetchContracts()
  }, [])

  const fetchContracts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contract`)
      setContracts(response.data)
    } catch (error) {
      console.error('Error fetching contracts:', error)
      toast.error('Failed to fetch contract items')
    }
  }

  const handleEditButtonClick = async (contractId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contract/${contractId}`)
      setCurrentContract(response.data)
      setIsReadOnly(true)
      setVisible(true)
    } catch (error) {
      console.error('Error fetching the contract item:', error)
      toast.error('Failed to fetch contract item')
    }
  }

  const handleCreateContract = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/contract`, newContract)
      setContracts([...contracts, response.data])
      setNewContract({
        name: '',
        version: 0,
        previousVersion: 0,
        body: '',
        type: 0,
        createDate: new Date().toISOString(),
        requiresAt: '',
        isActive: false,
      })
      setVisible(false)
      toast.success('Contract created successfully')
    } catch (error) {
      console.error('Error creating contract:', error)
      toast.error('Failed to create contract')
    }
  }

  return (
    <div>
      <ToastContainer />
      <CButton
        color="primary"
        className="mb-3"
        onClick={() => {
          setIsReadOnly(false)
          setVisible(true)
        }}
      >
        Yeni Kontrat Ekle
      </CButton>

      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">Sözleşme Adı</CTableHeaderCell>
            <CTableHeaderCell scope="col">Versiyon</CTableHeaderCell>
            <CTableHeaderCell scope="col">Durum</CTableHeaderCell>
            <CTableHeaderCell scope="col">Eylemler</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {contracts.map((contract) => (
            <CTableRow key={contract.contractId}>
              <CTableDataCell>{contract.name}</CTableDataCell>
              <CTableDataCell>{contract.version}</CTableDataCell>
              <CTableDataCell>{contract.isActive ? 'Aktif' : 'Pasif'}</CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="primary text-white"
                  className="me-2"
                  onClick={() => handleEditButtonClick(contract.contractId)}
                >
                  Düzenle
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>
            {currentContract ? 'Sözleşmeyi Görüntüle' : 'Yeni Sözleşme Ekle'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              className="mb-3"
              label="Sözleşme Adı"
              value={currentContract ? currentContract.name : newContract.name}
              onChange={(e) =>
                currentContract
                  ? setCurrentContract({ ...currentContract, name: e.target.value })
                  : setNewContract({ ...newContract, name: e.target.value })
              }
              readOnly={isReadOnly}
            />
            <CFormInput
              type="text"
              className="mb-3"
              label="Versiyon"
              value={currentContract ? currentContract.version : newContract.version}
              onChange={(e) =>
                currentContract
                  ? setCurrentContract({
                      ...currentContract,
                      version: parseInt(e.target.value, 10),
                    })
                  : setNewContract({ ...newContract, version: parseInt(e.target.value, 10) })
              }
              readOnly={isReadOnly}
            />
            <CFormInput
              type="text"
              className="mb-3"
              label="Önceki Versiyon"
              value={
                currentContract ? currentContract.previousVersion : newContract.previousVersion
              }
              onChange={(e) =>
                currentContract
                  ? setCurrentContract({
                      ...currentContract,
                      previousVersion: parseInt(e.target.value, 10),
                    })
                  : setNewContract({
                      ...newContract,
                      previousVersion: parseInt(e.target.value, 10),
                    })
              }
              readOnly={isReadOnly}
            />
            <CFormInput
              type="text"
              className="mb-3"
              label="İçerik"
              value={currentContract ? currentContract.body : newContract.body}
              onChange={(e) =>
                currentContract
                  ? setCurrentContract({ ...currentContract, body: e.target.value })
                  : setNewContract({ ...newContract, body: e.target.value })
              }
              readOnly={isReadOnly}
            />
            <CFormInput
              type="text"
              className="mb-3"
              label="Gereklilik"
              value={currentContract ? currentContract.requiresAt : newContract.requiresAt}
              onChange={(e) =>
                currentContract
                  ? setCurrentContract({ ...currentContract, requiresAt: e.target.value })
                  : setNewContract({ ...newContract, requiresAt: e.target.value })
              }
              readOnly={isReadOnly}
            />
            <CFormSwitch
              label="Durum"
              checked={currentContract ? currentContract.isActive : newContract.isActive}
              onChange={(e) =>
                currentContract
                  ? setCurrentContract({ ...currentContract, isActive: e.target.checked })
                  : setNewContract({ ...newContract, isActive: e.target.checked })
              }
              readOnly={isReadOnly}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Kapat
          </CButton>
          {!isReadOnly && (
            <CButton color="primary" onClick={handleCreateContract}>
              Oluştur
            </CButton>
          )}
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Contract

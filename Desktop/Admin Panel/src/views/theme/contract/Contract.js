import React, { useState, useEffect } from 'react'
import CIcon from '@coreui/icons-react'
import { cilNotes } from '@coreui/icons'
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
  CFormTextarea,
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
  const [isActive, setIsActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredContract, setFilteredContract] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase()
    const filteredData = contracts
      .filter(
        (contract) =>
          (contract.name && contract.name.toLowerCase().includes(lowercasedQuery)) ||
          (contract.version && contract.version.toString().toLowerCase().includes(lowercasedQuery)),
      )
      .sort((a, b) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1))

    setFilteredContract(filteredData)
  }, [searchQuery, contracts])

  useEffect(() => {
    fetchContracts()
  }, [])

  const fetchContracts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contract`)
      setContracts(response.data)
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching contracts:', error)
      toast.error('Failed to fetch contract items')
    }
  }

  const handleEditButtonClick = async (contractId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contract/${contractId}`)
      const fetchedContract = response.data
      setCurrentContract(fetchedContract)
      setIsActive(fetchedContract.isActive) // switch durumunu güncelle
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

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredContract.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredContract.length / itemsPerPage)

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
              Sözleşme Adı
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Versiyon
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
          {currentItems.map((contract) => (
            <CTableRow key={contract.contractId}>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {contract.name}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {contract.version}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    backgroundColor: contract.isActive ? '#d4edda' : '#f8d7da',
                    color: contract.isActive ? '#155724' : '#721c24',
                    border: `1px solid ${contract.isActive ? '#c3e6cb' : '#f5c6cb'}`,
                  }}
                >
                  {contract.isActive ? 'Aktif' : 'Pasif'}
                </div>
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                <CButton
                  color="primary text-white"
                  className="me-2"
                  onClick={() => handleEditButtonClick(contract.contractId)}
                >
                  <CIcon icon={cilNotes} />
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
            {currentContract && (
              <>
                <CFormInput
                  type="text"
                  className="mb-3"
                  label="Versiyon"
                  value={currentContract ? currentContract.version : ''}
                  onChange={(e) =>
                    setCurrentContract({
                      ...currentContract,
                      version: parseInt(e.target.value, 10),
                    })
                  }
                  readOnly={isReadOnly}
                />
                <CFormInput
                  type="text"
                  className="mb-3"
                  label="Önceki Versiyon"
                  value={currentContract ? currentContract.previousVersion : ''}
                  onChange={(e) =>
                    setCurrentContract({
                      ...currentContract,
                      previousVersion: parseInt(e.target.value, 10),
                    })
                  }
                  readOnly={isReadOnly}
                />
              </>
            )}

            <CFormTextarea
              type="text"
              className="mb-3"
              label="İçerik"
              rows={5}
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
              label={isActive ? 'Aktif' : 'Pasif'}
              checked={isActive}
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

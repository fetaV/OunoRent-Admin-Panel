import React, { useEffect, useState } from "react";
import CIcon from "@coreui/icons-react";
import { cilNotes, cilTrash } from "@coreui/icons";
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
} from "@coreui/react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "../../../../config";

function UserContract() {
  const [userContracts, setUserContracts] = useState([]);
  const [userContractName, setUserContractName] = useState("");
  const [userContractType, setUserContractType] = useState("");
  const [edituserContractId, setEditUserContractId] = useState(null);
  const [visible, setVisible] = useState(false);
  const [editUserContractData, setEditUserContractData] = useState({
    userContractId: "",
    subCategoryId: "",
    userContractName: "",
    largeImagegUrl: "",
    smallImageUrl: "",
    tags: "",
    slug: "",
    orderNumber: 0,
    date: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUserContract, setFilteredUserContract] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filteredData = userContracts.filter(
      (userContract) =>
        (userContract.fileName &&
          userContract.fileName.toLowerCase().includes(lowercasedQuery)) ||
        (userContract.user.name &&
          userContract.user.name.toLowerCase().includes(lowercasedQuery)) ||
        (userContract.contract.name &&
          userContract.contract.name.toLowerCase().includes(lowercasedQuery)) ||
        (userContract.contract.version &&
          userContract.contract.version
            .toString()
            .toLowerCase()
            .includes(lowercasedQuery))
    );
    setFilteredUserContract(filteredData);
  }, [searchQuery, userContracts]);

  useEffect(() => {
    const fetchuserContracts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/userContract`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setUserContracts(response.data);
        setFilteredUserContract(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchuserContracts();
  }, []);

  const handleDelete = async (userContractId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/userContract/${userContractId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserContracts(
        userContracts.filter(
          (userContract) => userContract.userContractId !== userContractId
        )
      );
      setFilteredUserContract(
        userContracts.filter(
          (userContract) => userContract.userContractId !== userContractId
        )
      );
      toast.success("userContract başarıyla silindi!");
    } catch (error) {
      console.error(error.response.data);
      toast.error("userContract silinirken bir hata oluştu!");
    }
  };

  const handleEditModalOpen = async (userContractId) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/userContract/${userContractId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    const userContractData = response.data;
    setEditUserContractId(userContractId);
    setEditUserContractData(userContractData);
    setUserContractName(userContractData.userContractName || "");
    setUserContractType(userContractData.userContractType || "");
    setVisible(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUserContract.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredUserContract.length / itemsPerPage);

  return (
    <>
      <ToastContainer />

      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="LiveDemoExampleLabel2"
      >
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel2">
            User Contract Detayları
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              id="fileName"
              label="Dosya Adı"
              value={editUserContractData.fileName || ""}
              readOnly
            />
            <CFormInput
              type="text"
              id="contractName"
              label="Kontrat Adı"
              value={editUserContractData.contract?.name || ""}
              readOnly
            />
            <CFormInput
              type="text"
              id="contractDetails"
              label="Kontrat İçeriği"
              value={editUserContractData.contract?.body || ""}
              readOnly
            />
            <CFormInput
              type="text"
              id="contractVersion"
              label="Kontrat Versiyonu"
              value={editUserContractData.contract?.version || ""}
              readOnly
            />
            <CFormInput
              type="text"
              id="userName"
              label="Kullanıcı Adı"
              value={editUserContractData.user?.name || ""}
              readOnly
            />
            <CFormInput
              type="text"
              id="userEmail"
              label="Kullanıcı E-Posta"
              value={editUserContractData.user?.email || ""}
              readOnly
            />
            <CFormInput
              type="text"
              id="userPhoneNumber"
              label="Kullanıcı Telefon Numarası"
              value={editUserContractData.user?.phoneNumber || ""}
              readOnly
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Kapat
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
            <CTableHeaderCell
              style={{ textAlign: "center", verticalAlign: "middle" }}
            >
              Kontrat Adı
            </CTableHeaderCell>
            <CTableHeaderCell
              style={{ textAlign: "center", verticalAlign: "middle" }}
            >
              Kontrat Versiyonu
            </CTableHeaderCell>
            <CTableHeaderCell
              style={{ textAlign: "center", verticalAlign: "middle" }}
            >
              Kullanıcı Adı
            </CTableHeaderCell>
            <CTableHeaderCell
              style={{ textAlign: "center", verticalAlign: "middle" }}
            >
              Dosya Adı
            </CTableHeaderCell>
            <CTableHeaderCell
              style={{ textAlign: "center", verticalAlign: "middle" }}
            >
              Eylemler
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentItems.map((userContract) => (
            <CTableRow key={userContract.userContractId}>
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                {userContract.contract.name}
              </CTableDataCell>
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                {userContract.contract.version}
              </CTableDataCell>
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                {userContract.user.name}
              </CTableDataCell>
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                {userContract.fileName}
              </CTableDataCell>
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                <CButton
                  color="primary"
                  className="me-2"
                  onClick={() =>
                    handleEditModalOpen(userContract.userContractId)
                  }
                >
                  <CIcon icon={cilNotes} />
                </CButton>
                <CButton
                  color="danger text-white"
                  onClick={() => handleDelete(userContract.userContractId)}
                >
                  <CIcon icon={cilTrash} />
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
  );
}

export default UserContract;

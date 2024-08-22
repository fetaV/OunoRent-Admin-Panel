import React, { useEffect, useState } from "react";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash, cilCheckCircle, cilXCircle } from "@coreui/icons";
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
  CPagination,
  CPaginationItem,
  CFormSwitch,
  CFormTextarea,
} from "@coreui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createFaq,
  createUser,
  deleteFaq,
  fetchFaq,
  fetchFaqForID,
  updateFaq,
  updateUser,
} from "src/api/useApi";

const Faq = () => {
  const [state, setState] = useState({
    faq: [],
    currentFaq: null,
    searchQuery: "",
    filteredFaq: [],
    faqData: {},
    currentPage: 1,
    modalVisible: false,
    editFaqId: null,
    text: "",
    isActive: true,
  });

  const itemsPerPage = 10;

  useEffect(() => {
    loadFaq();
  }, []);

  const loadFaq = async () => {
    const faq = await fetchFaq();
    setState((prevState) => ({
      ...prevState,
      faq,
      filteredFaq: faq,
      modalVisible: false,
    }));
  };

  const handleModalOpen = async (formId = null) => {
    if (formId) {
      const data = await fetchFaqForID(formId);
      setState((prevState) => ({
        ...prevState,
        faqData: data,
        editFaqId: formId,
        modalVisible: true,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        faqData: { label: "", text: "", orderNumber: "" },
        editFaqId: null,
        modalVisible: true,
        isActive: true,
      }));
    }
  };

  const handleSave = async () => {
    const { editFaqId, faqData } = state;

    if (editFaqId) {
      await updateFaq(editFaqId, faqData);
      toast.success("FAQ başarıyla güncellendi.");
    } else {
      await createFaq(faqData);
      toast.success("FAQ başarıyla oluşturuldu.");
    }

    setState((prev) => ({
      ...prev,
      modalVisible: false,
    }));
    await loadFaq();
  };

  const handleDelete = async (formId) => {
    await deleteFaq(formId);
    toast.success("FAQ başarıyla silindi!");

    const updatedFaq = await fetchFaq();
    setState((prevState) => ({
      ...prevState,
      faq: updatedFaq,
      filteredFaq: updatedFaq,
    }));
  };

  const handleToggleActive = async (faqId, currentStatus) => {
    const updatedFaq = {
      ...state.faq.find((item) => item.faqId === faqId),
      isActive: !currentStatus,
    };

    await updateFaq(faqId, updatedFaq);

    toast.success("FAQ durumu başarıyla güncellendi.");

    const updatedFaqList = await fetchFaq();
    setState((prevState) => ({
      ...prevState,
      faq: updatedFaqList,
      filteredFaq: updatedFaqList,
    }));
  };

  const indexOfLastItem = state.currentPage * itemsPerPage;
  const currentItems = state.filteredFaq.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );

  useEffect(() => {
    const filterFaq = () => {
      const lowercasedQuery = state.searchQuery.toLowerCase();
      const filteredData = state.faq.filter((item) =>
        [item.label, item.orderNumber.toString()]
          .map((field) => field.toLowerCase())
          .some((field) => field.includes(lowercasedQuery))
      );
      setState((prevState) => ({
        ...prevState,
        filteredFaq: filteredData,
      }));
    };

    filterFaq();
  }, [state.searchQuery, state.faq]);

  const tableHeaders = [
    { label: "Label", value: "label" },
    { label: "Order Number", value: "orderNumber" },
    { label: "Actions", value: "actions" },
  ];

  const handleInputChange = (e, field) => {
    setState((prevState) => ({
      ...prevState,
      faqData: { ...prevState.faqData, [field]: e.target.value },
    }));
  };

  return (
    <div>
      <ToastContainer />
      <CButton
        color="primary"
        className="mb-3"
        onClick={() => handleModalOpen()}
      >
        Yeni FAQ Ekle
      </CButton>
      <CFormInput
        type="text"
        id="search"
        placeholder="Arama"
        value={state.searchQuery}
        onChange={(e) =>
          setState((prevState) => ({
            ...prevState,
            searchQuery: e.target.value,
          }))
        }
      />
      <CTable hover>
        <CTableHead>
          <CTableRow>
            {tableHeaders.map(({ label, value }) => (
              <CTableHeaderCell
                key={value}
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                {label}
              </CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentItems.map((item) => (
            <CTableRow key={item.faqId}>
              {tableHeaders.slice(0, 2).map(({ value }) => (
                <CTableDataCell
                  key={value}
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  {item[value]}
                </CTableDataCell>
              ))}
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                <CButton
                  className={`text-white me-2 ${item.isActive ? "btn-success" : "btn-danger"}`}
                  onClick={() => handleToggleActive(item.faqId, item.isActive)}
                >
                  <CIcon icon={item.isActive ? cilCheckCircle : cilXCircle} />
                </CButton>
                <CButton
                  color="primary"
                  className="me-2"
                  onClick={() => handleModalOpen(item.faqId)}
                >
                  <CIcon icon={cilPencil} />
                </CButton>
                <CButton
                  color="danger"
                  onClick={() => handleDelete(item.faqId)}
                >
                  <CIcon icon={cilTrash} />
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
      <CPagination className="btn btn-sm">
        {Array.from(
          { length: Math.ceil(state.filteredFaq.length / itemsPerPage) },
          (_, i) => (
            <CPaginationItem
              key={i + 1}
              active={i + 1 === state.currentPage}
              onClick={() =>
                setState((prevState) => ({ ...prevState, currentPage: i + 1 }))
              }
            >
              {i + 1}
            </CPaginationItem>
          )
        )}
      </CPagination>
      <CModal
        visible={state.modalVisible}
        onClose={() =>
          setState((prevState) => ({ ...prevState, modalVisible: false }))
        }
      >
        <CModalHeader>
          <CModalTitle>FAQ {state.editFaqId ? "Güncelle" : "Ekle"}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              id="label"
              label="Label"
              value={state.faqData.label}
              onChange={(e) => handleInputChange(e, "label")}
            />
            <CFormTextarea
              id="text"
              label="Metin"
              rows={5}
              value={state.faqData.text}
              onChange={(e) => handleInputChange(e, "text")}
            />
            <CFormInput
              type="number"
              id="orderNumber"
              label="Sıra Numarası"
              value={state.faqData.orderNumber}
              onChange={(e) => handleInputChange(e, "orderNumber")}
            />
            {state.editFaqId === null && (
              <CFormSwitch
                id="isActive"
                label={state.isActive ? "Aktif" : "Pasif"}
                checked={state.isActive}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    isActive: e.target.checked,
                  }))
                }
              />
            )}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() =>
              setState((prevState) => ({ ...prevState, modalVisible: false }))
            }
          >
            Kapat
          </CButton>
          <CButton color="primary" onClick={handleSave}>
            Kaydet
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Faq;

import React, { useEffect, useState } from "react";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash } from "@coreui/icons";
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
  deleteFaq,
  fetchFaq,
  fetchFaqForID,
  updateFaq,
} from "src/api/useApi";

const Faq = () => {
  const [state, setState] = useState({
    faq: [],
    currentFaq: null,
    searchQuery: "",
    filteredFaq: [],
    currentPage: 1,
    modalVisible: false,
    editFaqId: null,
    text: "",
    isActive: true,
  });
  const itemsPerPage = 10;

  useEffect(() => {
    const loadFaq = async () => {
      const faq = await fetchFaq();
      setState((prevState) => ({
        ...prevState,
        faq,
        filteredFaq: faq,
      }));
    };
    loadFaq();
  }, []);

  const handleModalOpen = async (formId = null) => {
    if (formId) {
      const data = await fetchFaqForID(formId);
      setState((prevState) => ({
        ...prevState,
        label: data.label,
        text: data.text,
        orderNumber: data.orderNumber,
        editFaqId: formId,
        modalVisible: true,
        isActive: data.isActive,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        label: "",
        text: "",
        orderNumber: "",
        editFaqId: null,
        modalVisible: true,
        isActive: true,
      }));
    }
  };

  const handleSave = async () => {
    const { editFaqId, isActive, label } = state;

    const faqData = {
      label,
      text: "",
      orderNumber: 0,
      isActive,
    };

    if (editFaqId) {
      await updateFaq(editFaqId, faqData);
      toast.success("FAQ başarıyla güncellendi.");
    } else {
      await createFaq(faqData);
      toast.success("FAQ başarıyla oluşturuldu.");
    }

    const updatedFaq = await fetchFaq();
    setState((prevState) => ({
      ...prevState,
      modalVisible: false,
      faq: updatedFaq,
      filteredFaq: updatedFaq,
    }));
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
          .map((item) => item.toLowerCase() || item.toString())
          .some((item) => item.includes(lowercasedQuery))
      );
      setState((prevState) => ({
        ...prevState,
        filteredFaq: filteredData,
      }));
    };

    filterFaq();
  }, [state.searchQuery, state.faq]);

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
            {[
              { label: "Label", value: "label" },
              { label: "Order Number", value: "orderNumber" },
              { label: "Active", value: "isActive", isStatus: true },
              { label: "Actions", value: "actions" },
            ].map(({ label, value }) => (
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
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                {item.label}
              </CTableDataCell>
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                {item.orderNumber}
              </CTableDataCell>
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "5px 10px",
                    borderRadius: "8px",
                    backgroundColor: item.isActive ? "#d4edda" : "#f8d7da",
                    color: item.isActive ? "#155724" : "#721c24",
                    border: `1px solid ${item.isActive ? "#c3e6cb" : "#f5c6cb"}`,
                    cursor: "pointer",
                  }}
                  onClick={() => handleToggleActive(item.faqId)}
                >
                  {item.isActive ? "Aktif" : "Pasif"}
                </div>
              </CTableDataCell>
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
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

      <CPagination>
        {Array.from(
          {
            length: Math.ceil(state.filteredFaq.length / itemsPerPage),
          },
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
          setState((prevState) => ({
            ...prevState,
            modalVisible: false,
          }))
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
              value={state.label}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  label: e.target.value,
                }))
              }
            />
            <CFormTextarea
              type="text"
              id="text"
              label="Metin"
              rows={5}
              value={state.text}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  text: e.target.value,
                }))
              }
            />
            <CFormInput
              type="number"
              id="orderNumber"
              label="Sıra Numarası"
              value={state.orderNumber}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  orderNumber: e.target.value,
                }))
              }
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
              setState((prevState) => ({
                ...prevState,
                modalVisible: false,
              }))
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

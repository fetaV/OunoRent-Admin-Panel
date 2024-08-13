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
  CFormTextarea,
  CPagination,
  CPaginationItem,
} from "@coreui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  deleteContactForm,
  fetchContactForm,
  fetchContactFormForID,
} from "src/api/useApi";

const ContactForm = () => {
  const [state, setState] = useState({
    contactForms: [],
    filteredContactForms: [],
    editContactFormData: {},
    modalVisible: false,
    searchQuery: "",
    currentPage: 1,
  });

  const itemsPerPage = 10;

  useEffect(() => {
    const loadContactForms = async () => {
      const data = await fetchContactForm();
      setState((prevState) => ({
        ...prevState,
        contactForms: data,
        filteredContactForms: data,
      }));
    };

    loadContactForms();
  }, []);

  useEffect(() => {
    const filterContactForms = () => {
      const lowercasedQuery = state.searchQuery.toLowerCase();
      const filteredData = state.contactForms.filter((form) =>
        [form.name, form.email, form.subject, form.subjectCategory, form.body]
          .map((item) => item.toLowerCase())
          .some((item) => item.includes(lowercasedQuery))
      );
      setState((prevState) => ({
        ...prevState,
        filteredContactForms: filteredData,
      }));
    };

    filterContactForms();
  }, [state.searchQuery, state.contactForms]);

  const handleDelete = async (formId) => {
    await deleteContactForm(formId);
    toast.success("İletişim formu başarıyla silindi!");
    setState((prevState) => ({
      ...prevState,
      contactForms: prevState.contactForms.filter(
        (form) => form.contactFormId !== formId
      ),
      filteredContactForms: prevState.filteredContactForms.filter(
        (form) => form.contactFormId !== formId
      ),
    }));
  };

  const handleEditModalOpen = async (formId) => {
    const data = await fetchContactFormForID(formId);
    setState((prevState) => ({
      ...prevState,
      editContactFormData: data,
      modalVisible: true,
    }));
  };

  const indexOfLastItem = state.currentPage * itemsPerPage;
  const currentItems = state.filteredContactForms.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return `${text.substring(0, maxLength)}...`;
    }
    return text;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${formattedDate} ${formattedTime}`;
  };
  return (
    <>
      <ToastContainer />
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

      <CModal
        visible={state.modalVisible}
        onClose={() =>
          setState((prevState) => ({ ...prevState, modalVisible: false }))
        }
      >
        <CModalHeader>
          <CModalTitle>İletişim Formu İncele</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {state.editContactFormData && (
            <CForm>
              {[
                { label: "İsim", value: "name", type: "text" },
                { label: "Email", value: "email", type: "email" },
                { label: "Konu", value: "subject", type: "text" },
                {
                  label: "Kategori Konusu",
                  value: "subjectCategory",
                  type: "text",
                },
              ].map(({ label, value, type }) => (
                <CFormInput
                  key={value}
                  type={type}
                  className="mb-3"
                  label={label}
                  value={state.editContactFormData[value] || ""}
                  readOnly
                />
              ))}
              <CFormTextarea
                className="mb-3"
                label="Metin"
                rows={8}
                value={state.editContactFormData.body || ""}
                readOnly
              />
            </CForm>
          )}
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
        </CModalFooter>
      </CModal>

      <CTable hover>
        <CTableHead>
          <CTableRow>
            {["İsim", "Email", "Konu", "Kategori", "Tarih", "Aksiyonlar"].map(
              (header) => (
                <CTableHeaderCell key={header}>{header}</CTableHeaderCell>
              )
            )}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentItems.map((form) => (
            <CTableRow key={form.id}>
              {["name", "email", "subject", "subjectCategory", "formDate"].map(
                (key) => (
                  <CTableDataCell key={key}>
                    {key === "formDate"
                      ? formatDate(form[key])
                      : truncateText(form[key], 30)}
                  </CTableDataCell>
                )
              )}

              <CTableDataCell>
                <CButton
                  color="info"
                  className="me-2"
                  onClick={() => handleEditModalOpen(form.contactFormId)}
                >
                  <CIcon icon={cilNotes} />
                </CButton>
                <CButton
                  color="danger"
                  onClick={() => handleDelete(form.contactFormId)}
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
            length: Math.ceil(state.filteredContactForms.length / itemsPerPage),
          },
          (_, i) => (
            <CPaginationItem
              key={i + 1}
              active={i + 1 === state.currentPage}
              onClick={() =>
                setState((prevState) => ({
                  ...prevState,
                  currentPage: i + 1,
                }))
              }
            >
              {i + 1}
            </CPaginationItem>
          )
        )}
      </CPagination>
    </>
  );
};

export default ContactForm;

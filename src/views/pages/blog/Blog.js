import React, { useEffect, useState, useRef } from "react";
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
  CRow,
  CCol,
  CPagination,
  CPaginationItem,
  CFormSelect,
  CFormSwitch,
} from "@coreui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createBlog,
  fetchBlog,
  fetchBlogForID,
  deleteBlog,
  updateBlog,
  fetchCategory,
  fetchSubCategory,
  fetchSubCategoryForID,
} from "src/api/useApi";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./ckeditor-styles.css";
import "../blog/ckeditor-styles.css";

function Blog() {
  const [state, setState] = useState({
    blog: [],
    blogData: {},
    categories: [],
    subCategories: [],
    modalVisible: false,
    searchQuery: "",
    categoryData: {},
    deleteModalVisible: null,
    filteredBlog: [],
    currentPage: 1,
  });
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);

  const itemsPerPage = 10;

  const loadBlog = async () => {
    const [blog, categories] = await Promise.all([
      fetchBlog(),
      fetchCategory(),
    ]);
    setState((prevState) => ({
      ...prevState,
      categories,
      blog: blog,
      filteredBlog: blog,
      modalVisible: false,
    }));
  };
  useEffect(() => {
    loadBlog();
  }, []);

  useEffect(() => {
    if (state.blogData?.categories?.categoryId) {
      fetchSubCategory(state.blogData?.categories?.categoryId).then((data) => {
        setState((prevState) => ({
          ...prevState,
          blogData: {
            subCategories: data,
          },
        }));
      });
    }
  }, [state.blogData?.categories?.categoryId]);

  const handleModalOpen = async (blogId = null) => {
    if (blogId) {
      const data = await fetchBlogForID(blogId);
      setState((prevState) => ({
        ...prevState,
        blogData: data,
        blogId,
        modalVisible: true,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        blogData: {},
        blogId: null,
        modalVisible: true,
      }));
    }
  };

  const handleSave = async () => {
    const { blogId, blogData } = state;

    if (blogId) {
      setState((prevState) => ({
        ...prevState,
        blogData: {
          ...blogData,
          smallImageUrl: undefined,
          largeImageUrl: undefined,
        },
      }));

      await updateBlog(blogId, blogData);
      toast.success("Blog başarıyla güncellendi.");
    } else {
      await createBlog(blogData);
      toast.success("Blog başarıyla oluşturuldu.");
    }

    loadBlog();
  };

  const handleFileChange = (e) => {
    const id = e.target.id;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (id === "small") {
          setState((prevState) => ({
            ...prevState,
            blogData: {
              ...prevState.blogData,
              smallImage: reader.result,
            },
          }));
        } else if (id === "large") {
          setState((prevState) => ({
            ...prevState,
            blogData: {
              ...prevState.blogData,
              largeImage: reader.result,
            },
          }));
        }
      };

      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const filterBlog = () => {
      const lowercasedQuery = state.searchQuery.toLowerCase();
      const filteredData = state.blog.filter((item) => {
        const title = item.title ? item.title.toLowerCase() : "";

        return [title].some((value) => value.includes(lowercasedQuery));
      });

      setState((prevState) => ({
        ...prevState,
        filteredBlog: filteredData,
      }));
    };

    filterBlog();
  }, [state.searchQuery]);

  const indexOfLastItem = state.currentPage * itemsPerPage;
  const currentItems = state.filteredBlog.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );

  const handleToggleActive = async (blogId, currentStatus) => {
    const updatedBlog = {
      ...state.blog.find((item) => item.blogId === blogId),
      isActive: !currentStatus,
    };
    console.log(updatedBlog);

    await updateBlog(blogId, updatedBlog);

    toast.success("Blog durumu başarıyla güncellendi.");

    const updatedBlogList = await fetchBlog();

    setState((prevState) => ({
      ...prevState,
      blog: updatedBlogList,
      filteredBlog: updatedBlogList,
    }));
  };

  const handleDeleteClick = (blogId) => {
    setState((prevState) => ({
      ...prevState,
      deleteBlogId: blogId,
      deleteModalVisible: true,
    }));
  };

  const confirmDelete = async () => {
    await deleteBlog(state.deleteBlogId);
    toast.success("Blog başarıyla silindi!");
    const updatedBlog = await fetchBlog();
    setState((prevState) => ({
      ...prevState,
      blog: updatedBlog,
      filteredBlog: updatedBlog,
      deleteModalVisible: false,
      deleteBlogId: null,
    }));
  };

  return (
    <>
      <ToastContainer />
      <CButton
        color="primary"
        className="mb-3"
        onClick={() => handleModalOpen()}
      >
        Yeni Blog Ekle
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

      <CModal
        className="modal-xl"
        visible={state.modalVisible}
        onClose={() =>
          setState((prevState) => ({ ...prevState, modalVisible: false }))
        }
        aria-labelledby="ModalLabel"
      >
        <CModalHeader>
          <CModalTitle id="ModalLabel">
            {state.blogData?.blogId ? "Blog Düzenle" : "Yeni Blog Ekle"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              {[
                { label: "Başlık", value: "title", md: 6 },
                { label: "Sıra Numarası", value: "orderNumber", md: 6 },
              ].map(({ label, value, md }) => (
                <CCol key={value} md={md}>
                  <CFormInput
                    className="mb-3"
                    label={label}
                    value={state.blogData?.[value] || ""}
                    onChange={(e) =>
                      setState((prevState) => ({
                        ...prevState,
                        blogData: {
                          ...prevState.blogData,
                          [value]: e.target.value,
                        },
                      }))
                    }
                  />
                </CCol>
              ))}
            </CRow>
            <CRow className="mb-3">
              {[
                { label: "Etiketler", value: "tags", md: 6 },
                { label: "Slug", value: "slug", md: 6 },
              ].map(({ label, value, md, type = "text" }) => (
                <CCol key={value} md={md}>
                  <CFormInput
                    key={value}
                    className="mb-3"
                    type={type}
                    label={label}
                    value={state.blogData?.[value] || ""}
                    onChange={(e) =>
                      setState((prevState) => ({
                        ...prevState,
                        blogData: {
                          ...prevState.blogData,
                          [value]: e.target.value,
                        },
                      }))
                    }
                  />
                </CCol>
              ))}
              {[
                {
                  key: "largeImage",
                  label: "Mevcut Large Image",
                  ref: fileInputRef1,
                  defaultImage:
                    "https://png.pngtree.com/png-vector/20210604/ourmid/pngtree-gray-network-placeholder-png-image_3416659.jpg",
                },
                {
                  key: "smallImage",
                  label: "Mevcut Small Image",
                  ref: fileInputRef2,
                  defaultImage:
                    "https://png.pngtree.com/png-vector/20210604/ourmid/pngtree-gray-network-placeholder-png-image_3416659.jpg",
                },
              ].map(({ key, label, ref, defaultImage }) => (
                <div key={key} className="mb-3 col-md-6">
                  <label className="d-flex">{label}</label>
                  <div className="image-container m-1">
                    <img
                      onClick={() => {
                        if (ref.current) {
                          ref.current.click();
                        }
                      }}
                      src={
                        state.blogData?.[key]?.startsWith("data:image")
                          ? state.blogData?.[key]
                          : state.blogData?.[`${key}Url`]
                            ? `http://10.10.3.181:5244/${state.blogData?.[`${key}Url`]}`
                            : defaultImage
                      }
                      style={{ width: 200, height: "auto" }}
                      alt={label}
                    />
                    <button
                      className="edit-button"
                      onClick={() => {
                        if (ref.current) {
                          ref.current.click();
                        }
                      }}
                    >
                      {state.blogData?.categories?.categoryId
                        ? "Güncelle"
                        : "Kaydet"}
                    </button>
                  </div>
                </div>
              ))}
            </CRow>

            <CFormInput
              type="file"
              className="mb-3 d-none"
              onChange={handleFileChange}
              id="large"
              ref={fileInputRef1}
            />

            <CFormInput
              type="file"
              className="mb-3 d-none"
              onChange={handleFileChange}
              id="small"
              ref={fileInputRef2}
            />
            <CRow className="mt-5">
              <CCol className="mt-5">
                <CFormSelect
                  label="Kategori"
                  className="mb-3"
                  aria-label="Select category"
                  onChange={(e) => {
                    setState((prevState) => ({
                      ...prevState,
                      blogData: {
                        ...prevState.blogData,
                        categories: {
                          categoryId: e.target.value,
                        },
                        subCategories: {
                          subCategoryId: "",
                        },
                      },
                    }));
                  }}
                  value={state.blogData?.categories?.categoryId}
                >
                  <option value="">Kategori Seçiniz</option>
                  {state.categories.map((category) => (
                    <option
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol className="mt-5">
                <CFormSelect
                  label="Alt Kategori"
                  className="mb-3"
                  aria-label="Select subcategory"
                  onChange={(e) => {
                    setState((prevState) => ({
                      ...prevState,
                      blogData: {
                        ...prevState.blogData,
                        subCategories: {
                          subCategoryId: e.target.value,
                        },
                      },
                    }));
                  }}
                  value={state.blogData?.subCategories?.subCategoryId}
                  disabled={!state.blogData?.categories?.categoryId}
                >
                  <option value="">Alt Kategori Seçiniz</option>
                  {state.subCategories.map((subCategory) => (
                    <option
                      key={subCategory.subCategoryId}
                      value={subCategory.subCategoryId}
                    >
                      {subCategory.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
            <div className="mb-3">
              <label htmlFor="body" className="form-label">
                Metin
              </label>
              <CKEditor
                editor={ClassicEditor}
                data={state.blogData?.body}
                onChange={(event, editor) =>
                  setState(() => ({
                    ...state,
                    blogData: {
                      ...state.blogData,
                      body: editor.getData(),
                    },
                  }))
                }
              />
            </div>
            {state.blogData?.blogId === null && (
              <CFormSwitch
                label="Aktif"
                id="isActive"
                className="mb-3"
                checked={state.blogData?.isActive}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    blogData: {
                      ...prevState.blogData,
                      isActive: e.target.checked,
                    },
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
            {state.blogData?.blogId ? "Güncelle" : "Kaydet"}
          </CButton>
        </CModalFooter>
      </CModal>
      <CTable hover>
        <CTableHead>
          <CTableRow>
            {[
              { label: "Başlık", value: "title" },
              { label: "Sıra Numarası", value: "orderNumber" },
              { label: "Büyük Resim", value: "largeImageUrl", isImage: true },
              { label: "Küçük Resim", value: "smallImageUrl", isImage: true },
              { label: "Etiketler", value: "tags" },
              { label: "Slug", value: "slug" },
              { label: "Alt Kategori", value: "subCategoryName" },
              { label: "Eylemler", value: "actions" },
            ].map(({ label, value, isImage, isStatus }) => (
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
          {currentItems.map((blog) => (
            <CTableRow key={blog.blogId}>
              {[
                { value: "title", isImage: false, isStatus: false },
                { value: "orderNumber", isImage: false, isStatus: false },
                { value: "largeImageUrl", isImage: true, isStatus: false },
                { value: "smallImageUrl", isImage: true, isStatus: false },
                { value: "tags", isImage: false, isStatus: false },
                { value: "slug", isImage: false, isStatus: false },
                { value: "subCategoryName", isImage: false, isStatus: false },
              ].map(({ value, isImage, isStatus }) => (
                <CTableDataCell
                  key={value}
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  {isImage ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={`http://10.10.3.181:5244/${blog[value]}`}
                        style={{
                          width: isImage ? "100px" : "50px",
                          height: "auto",
                        }}
                      />
                    </div>
                  ) : (
                    blog[value]
                  )}
                </CTableDataCell>
              ))}
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                <CButton
                  className={`text-white me-2 ${blog.isActive ? "btn-success" : "btn-danger"}`}
                  onClick={() => handleToggleActive(blog.blogId, blog.isActive)}
                >
                  {blog.isActive ? (
                    <CIcon icon={cilCheckCircle} />
                  ) : (
                    <CIcon icon={cilXCircle} />
                  )}
                </CButton>
                <CButton
                  color="primary text-white"
                  className="me-2"
                  onClick={() => {
                    handleModalOpen(blog.blogId);
                  }}
                >
                  <CIcon icon={cilPencil} />
                </CButton>
                <CButton
                  color="danger text-white"
                  onClick={() => handleDeleteClick(blog.blogId)}
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
          { length: Math.ceil(state.filteredBlog.length / itemsPerPage) },
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
        alignment="center"
        visible={state.deleteModalVisible}
        onClose={() =>
          setState((prevState) => ({
            ...prevState,
            deleteModalVisible: false,
            deleteBlogId: null,
          }))
        }
      >
        <CModalHeader>
          <CModalTitle>Bu Blogu silmek istediğinize emin misiniz?</CModalTitle>
        </CModalHeader>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() =>
              setState((prevState) => ({
                ...prevState,
                deleteModalVisible: false,
                deleteBlogId: null,
              }))
            }
          >
            İptal
          </CButton>
          <CButton color="danger text-white" onClick={confirmDelete}>
            Sil
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
}

export default Blog;

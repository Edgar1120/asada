import React, { useState, useEffect } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import MUIDataTable from "mui-datatables";
import Swal from 'sweetalert2';

const url = "http://localhost:4000/bodega/";

const options = {
    selectableRows: false,
    responsive: "standard",
    pagination: true,
    rowsPerPage: 5,
    textLabels: {
        body: {
            noMatch: "No se han encontrado resultados con los datos digitados",
            toolTip: "Ordenar",
        },
        toolbar: {
            search: "Buscar",
            downloadCsv: "Descargar CSV",
            print: "Imprimir",
            viewColumns: "Ver Columnas",
            filterTable: "Filtrar Tabla",
        },
        filter: {
            all: "Todos",
            title: "Filtros",
            reset: "Reiniciar",
        },
        viewColumns: {
            title: "Mostrar Columnas",
            titleAria: "Mostrar/Ocultar Columnas",
        },
        selectedRows: {
            text: "Fila(s) seleccionada",
            delete: "Eliminar",
            deleteAria: "Eliminar Columna Seleccionada",
        },
        pagination: {
            next: "Siguiente Página",
            previous: "Anterior Página",
            rowsPerPage: "Filas por página:",
            displayRows: "de"
        }
    },
    rowsPerPageOptions: [5, 10, 15]
};
export function Bodega() {

    const [bodegas, setBodega] = useState([]);
    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);

    const [form, setForm] = useState({
        pIdBodega: '',
        pNombreBodega: '',
        pUbicacion: '',
    });

    useEffect(() => {
        get();
    }, []);

    const validateForm = () => {
        if (!form.pNombreBodega || !form.pUbicacion) {
            Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
            return false;
        }
        return true;
    };

    const get = async () => {
        try {
            const response = await axios.get(url + "getBodega");
            setBodega(response.data);
        } catch (error) {
            console.log(error.message);
        }
    };

    const peticionPost = async () => {
        if (!validateForm()) return;
        try {
            await axios.post(url + "agregarBodega", form);
            toggleModalInsertar();
            get();
            Swal.fire('Bodega agregada', 'La bodega se ha agregado correctamente', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudo agregar la bodega', 'error');
            console.log(error.message);
        }
    };

    const peticionPut = async () => {
        if (!validateForm()) return;

        try {
            await axios.put(url + "actualizarBodega/" + form.pIdBodega, form);
            toggleModalInsertar();
            get();
            Swal.fire('Bodega actualizada', 'La bodega se ha actualizado correctamente', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar la bodega', 'error');
            console.log(error.message);
        }
    };

    const peticionDelete = async (form) => {
        try {
          const response = await axios.delete(url + "eliminarBodega/" + form.pIdBodega);
          const { message } = response.data;
      
          if (message.startsWith('No se puede')) {
            Swal.fire('Error', message, 'error');
          } else if (message.startsWith('La bodega')) {
            Swal.fire('Error', message, 'error');
          } else {
            Swal.fire('Bodega eliminada', message, 'success');
            setModalEliminar(false);
            get();
          }
        } catch (error) {
          Swal.fire('Error', 'La bodega no se pudo eliminar esta siendo utilizada', 'error');
          console.log(error.message);
        }
      };

    const selectBodega = (bodega) => {
        setForm({
            pIdBodega: bodega.IdBodega,
            pNombreBodega: bodega.NombreBodega,
            pUbicacion: bodega.Ubicacion,
            tipoModal: 'actualizar'
        });
    };

    const toggleModalInsertar = () => {
        setModalInsertar(!modalInsertar);
    };



    const handleChange = async (e) => {
        e.persist();
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleDelete = (idBodega) => {
        setForm({ pIdBodega: idBodega });
        setModalEliminar(true);
    };

    const handleUpdate = (bodega) => {
        selectBodega(bodega);
        toggleModalInsertar();
    };

    const columns = [
        {
            name: "IdBodega",
            label: "Id Bodega"
        },
        {
            name: "NombreBodega",
            label: "Nombre Bodega"
        },
        {
            name: "Ubicacion",
            label: "Ubicacion"
        },
        {
            name: "acciones",
            label: "Acciones",
            options: {
                customBodyRenderLite: (dataIndex, rowIndex) => {
                    const bodega = bodegas[dataIndex];
                    return (
                        <>

                            <button className="btn-modal" onClick={() => handleDelete(bodega.IdBodega)}>
                                <span><FontAwesomeIcon icon={faTrashAlt} /></span>
                            </button>

                            <button className="btn-modal" onClick={() => handleUpdate(bodega)}>
                                <span><FontAwesomeIcon icon={faEdit} /> </span>
                            </button>
                        </>
                    );
                }
            }
        }

    ]


    return (
        <>

            <div className="Bodega">
                <br />
                <div className="center-content" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn" onClick={() => { setForm(null); setForm({ tipoModal: 'insertar' }); setModalInsertar(true); }}>
                        <span> <FontAwesomeIcon icon={faPlus} /></span>
                    </button>
                </div>

                <br /><br />
                <div className="table-container">
                    <MUIDataTable
                        title={"Bodegas "}
                        data={bodegas}
                        columns={columns}
                        options={options}
                    />
                </div>


                <Modal isOpen={modalInsertar}>

                    <ModalHeader style={{ display: 'block' }}>
                        <span style={{ float: 'right', cursor: 'pointer' }} onClick={() => toggleModalInsertar()}>x</span>
                        <h1>{form.tipoModal === 'insertar' ? 'Agregar Bodega' : 'Actualizar Bodega'}</h1>
                    </ModalHeader>
                    <ModalBody>

                        <div className="form-group">


                            <br />
                            <input className="custom-input" placeholder='Nombre Bodega' type="text" name="pNombreBodega" id="pNombreBodega" onChange={handleChange} value={form ? form.pNombreBodega : ''} />
                            <br />
                            <br />
                            <input className="custom-input" placeholder='Ubicacion' type="text" name="pUbicacion" id="pUbicacion" onChange={handleChange} value={form ? form.pUbicacion : ''} />
                            <br />
                            <br />

                        </div>
                    </ModalBody>

                    <ModalFooter>
                        {form.tipoModal === 'insertar' ?
                            <button className="btn-modal " onClick={() => peticionPost()}>
                                <span>Insertar</span>
                            </button> :
                            <button className="btn-modal " onClick={() => peticionPut()}>
                                <span>Actualizar</span>
                            </button>
                        }
                        <button className="btn-modal" onClick={() => setModalInsertar(false)}><span>Cancelar</span></button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={modalEliminar}>
                    <ModalBody>
                        Estás seguro que deseas eliminar la Bodega {form && form.pNombreBodega}
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn-modal" onClick={() => peticionDelete()}>
                            <span>Sí</span>
                        </button>
                        <button className="btn-modal" onClick={() => setModalEliminar(false)}>
                            <span>No</span>
                        </button>
                    </ModalFooter>
                </Modal>


            </div>
        </>
    )

}

export default Bodega;
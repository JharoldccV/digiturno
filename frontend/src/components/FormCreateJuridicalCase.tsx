import { Formik } from "formik";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

const FormCreateJuridicalCase: React.FC<
  {
    handleBack: () => void;
    handleSave: (value: { observation: string, subject: string }) => void;
  }> = ({
    handleBack,
    handleSave,
  }) => {
    const initialValues: Partial<{
      subject: string,
      observation: string,
    }> = {
    };
    return (
      <Formik
        initialValues={initialValues}
        validate={(values) => {
          const errors: Partial<{ subject: string, observation: string }> = {};
          if (values.subject === "") {
            errors.subject = "El asunto es obligatorio";
          }
          if (values.observation === "") {
            errors.observation = "La observación es obligatoria";
          }
          console.log(errors);
          return errors;
        }}
        onSubmit={(values) => {
          if (values) {
            handleSave({
              observation: values.observation!,
              subject: values.subject!,
            });
          }

        }}
      >
        {({ values, errors, handleChange, handleSubmit, submitForm, }) => (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 mt-4">
              <div className='col-span-1'>
                <label className="font-semibold">Asunto</label>
                <input
                  type="text"
                  name="subject"
                  value={values.subject}
                  onChange={handleChange("subject")}
                  className="border rounded px-3 py-2 w-full"
                />

                {errors.subject && <div className='text-danger text-sm'>{errors.subject}</div>}
              </div>

              <div className="col-span-1">
                <label className="font-semibold">Observación</label>
                <ReactQuill
                  value={values.observation}
                  onChange={handleChange("observation")}
                  className="rounded h-60"
                />
                {errors.observation && <div className='text-danger text-sm'>{errors.observation}</div>}
              </div>

              <div className="col-span-1 flex justify-end mt-10 gap-x-4">
                <button
                  type='submit'
                  onClick={submitForm}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Guardar
                </button>
                <button
                  type='button'
                  onClick={handleBack}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Volver
                </button>
              </div>
            </div>

          </form>
        )}
      </Formik>
    )
  };
export default FormCreateJuridicalCase;
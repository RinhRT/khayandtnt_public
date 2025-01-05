export default function UploadFile(props) {
    const { header, label, submit, onFileUpload, func } = props;

    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Lấy tệp tin đầu tiên
        if (file && onFileUpload) {
            onFileUpload(file); // Gửi tệp tin về cho thành phần cha
        }
    };

    return (
        <div className="form">
            <h2>{header}</h2>
            <label>
                {label}
                <input type="file" onChange={handleFileChange} accept=".csv, .xlsx" />
            </label>
            <button
                className="submit-button upload__button"
                onClick={func}
            >{submit}</button>
        </div>
    );
}
import styles from "./Modal.module.css";

interface ModalProps {
    children?: React.ReactNode;
    isOpen: boolean;
    onRequestClose?: () => void;
    style?: {
        content?: React.CSSProperties;
        overlay?: React.CSSProperties;
    };
}

const Modal = ({ children, isOpen, onRequestClose, style }: ModalProps) => {
    if (!isOpen) {
        return null;
    }

    return (
        <>
            <div
                onClick={() => {
                    onRequestClose && onRequestClose();
                }}
                className={styles["overlay"]}
                style={style?.overlay}
            />
            <div className={styles["modalCard"]} style={style?.content}>
                {children}
            </div>
        </>
    );
};

export default Modal;

package uz.encode.ecommerce.Units.exception;

public class UnitNotFoundException extends RuntimeException {
    public UnitNotFoundException(String message) {
        super(message);
    }

    public UnitNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}

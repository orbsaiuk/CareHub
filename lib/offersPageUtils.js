export async function copyToClipboard(text) {
    try {
        // Check if clipboard API is available
        if (!navigator.clipboard) {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            const successful = document.execCommand("copy");
            document.body.removeChild(textArea);

            return successful;
        }

        // Use modern clipboard API
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error("Failed to copy to clipboard:", error);
        return false;
    }
}
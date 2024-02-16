document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchBtn').addEventListener('click', searchAndNavigate);
    document.getElementById('englishTerm').addEventListener('keypress', handleKeyPress);

    const params = new URLSearchParams(window.location.search);
    const term = params.get('term');
    const translation = params.get('translation');

    document.getElementById('detailResult').innerText = `${term} : ${translation}`;
});
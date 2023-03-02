export function greet() {
    const hr = new Date().getHours();
    return hr < 12 ? 'Good Morning' : (hr < 18 ? 'Good Afternoon' : 'Good Evening')
}

export function greetEmoji() {
    const hr = new Date().getHours();
    return hr < 12 ? '☀' : (hr < 18 ? '🌤' : '🌘')
}
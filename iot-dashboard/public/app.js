// Initialize Socket.IO connection
const socket = io();

// Initialize Chart.js
const ctx = document.getElementById('sensorChart').getContext('2d');
const maxDataPoints = 20;
const initialData = {
    labels: [],
    datasets: [
        {
            label: 'Temperature (°C)',
            borderColor: '#e74c3c',
            data: [],
            fill: false
        },
        {
            label: 'Humidity (%)',
            borderColor: '#3498db',
            data: [],
            fill: false
        }
    ]
};

const chart = new Chart(ctx, {
    type: 'line',
    data: initialData,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'minute',
                    displayFormats: {
                        minute: 'HH:mm:ss'
                    }
                },
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                beginAtZero: true,
                suggestedMax: 100
            }
        },
        animation: {
            duration: 0
        }
    }
});

// Update status indicators
function updateStatus() {
    fetch('/status')
        .then(response => response.json())
        .then(status => {
            document.getElementById('mqtt-status').className = 
                `badge ${status.mqtt === 'Connected' ? 'bg-success' : 'bg-danger'}`;
            document.getElementById('mqtt-status').textContent = 
                `MQTT: ${status.mqtt}`;

            document.getElementById('server-status').className = 
                `badge ${status.server === 'Online' ? 'bg-success' : 'bg-danger'}`;
            document.getElementById('server-status').textContent = 
                `Server: ${status.server}`;
        })
        .catch(error => {
            console.error('Error fetching status:', error);
            document.getElementById('mqtt-status').className = 'badge bg-danger';
            document.getElementById('mqtt-status').textContent = 'MQTT: Error';
            document.getElementById('server-status').className = 'badge bg-danger';
            document.getElementById('server-status').textContent = 'Server: Error';
        });
}

// Update chart with new data
function updateChart(data) {
    const timestamp = new Date(data.timestamp);
    
    // Update current readings
    document.getElementById('temperature').textContent = data.temperature.toFixed(1);
    document.getElementById('humidity').textContent = data.humidity.toFixed(1);
    document.getElementById('last-update').textContent = timestamp.toLocaleTimeString();

    // Update chart
    chart.data.labels.push(timestamp);
    chart.data.datasets[0].data.push(data.temperature);
    chart.data.datasets[1].data.push(data.humidity);

    // Remove old data points if we exceed maxDataPoints
    if (chart.data.labels.length > maxDataPoints) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
        chart.data.datasets[1].data.shift();
    }

    chart.update();
}

// Socket.IO event listeners
socket.on('connect', () => {
    console.log('Connected to server');
    updateStatus();
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
    updateStatus();
});

socket.on('sensorData', (data) => {
    updateChart(data);
});

// Update status every 5 seconds
setInterval(updateStatus, 5000);

// Initial status check
updateStatus();

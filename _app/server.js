import LiveServer from "live-server"

export const server = () => {
    LiveServer.start({
        root: 'dist',
        open: true,
        host: 'localhost',
        port: '3000'
    })
}
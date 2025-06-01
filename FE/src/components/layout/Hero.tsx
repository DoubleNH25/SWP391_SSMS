export function Hero() {
    return (
        <section className="bg-blue-500 p-4 h-full">
            <div>
                <h1 className="text-4xl font-bold text-white">Welcome to Our Clinic</h1>
                <p className="mt-2 text-lg text-white">
                    Your health is our priority. Book an appointment today!
                </p>
                <a
                    href="/book-appointment"
                    className="mt-4 inline-block bg-white text-blue-500 px-6 py-3 rounded-md hover:bg-gray-200"
                >
                    Book Appointment
                </a>
            </div>
        </section>
    );
}
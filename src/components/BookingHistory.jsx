function BookingHistory(){

    return(

        <div className="history">

            <h2>Booking History</h2>

            <table>

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Date</th>

                        <th>Status</th>

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        <td>NC1001</td>

                        <td>10 Jul 2026</td>

                        <td>Completed</td>

                    </tr>

                    <tr>

                        <td>NC1002</td>

                        <td>08 Jul 2026</td>

                        <td>Completed</td>

                    </tr>

                </tbody>

            </table>

        </div>

    )

}

export default BookingHistory;
import React from "react";

class NewApptForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            vin:"",
            custName:"",
            apptDate:"",
            technician:"",
            apptReason:"",
            status: "scheduled",
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeVin = this.handleChangeVin.bind(this);
        this.handleChangeCustomer = this.handleChangeCustomer.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChangeTechnician = this.handleChangeTechnician.bind(this);
        this.handleChangeReason = this.handleChangeReason.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);

    }

    async handleSubmit(event) {
        event.preventDefault();
        const data = {...this.state};
        data.cust_name = data.custName;
        data.appt_date = data.apptDate;
        data.appt_reason = data.apptReason;
        delete data.custName;
        delete data.apptDate;
        delete data.apptReason;

        const serviceUrl = "http://localhost:8080/api/services/"
        const fetchOptions = {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        }
        const response = await fetch(serviceUrl, fetchOptions);
        if(response.ok){
            const newService = await response.json();

            this.setState({
                vin:"",
                custName:"",
                apptDate:"",
                technician:"",
                apptReason:"",
                status: "scheduled",
            });
        }
    }

    handleChangeVin(event) {
        const value = event.target.value;
        this.setState ({vin: value});
    }

    handleChangeCustomer(event) {
        const value = event.target.value;
        this.setState ({custName: value});
    }

    handleChangeDate(event) {
        const value = event.target.value;
        this.setState ({apptDate: value});
    }


    handleChangeTechnician(event) {
        const value = event.target.value;
        this.setState ({technician: value});
    }

    handleChangeReason(event) {
        const value = event.target.value;
        this.setState ({apptReason: value});
    }

    handleChangeStatus(event) {
        const value = event.target.value;
        this.setState ({status: value});
    }


    render() {
        return (
            <div className="row">
              <div className="offset-3 col-6">
                <div className="shadow p-4 mt-4">
                  <h1>Create a new service appointment</h1>
                  <form onSubmit={this.handleSubmit} id="new-appt-form">
                    <div className="form-floating mb-3">
                      <input onChange={this.handleChangeVin} value={this.state.vin} placeholder="vin" required type="text" name="vin" id="vin" className="form-control" />
                      <label htmlFor="vin">VIN</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input onChange={this.handleChangeCustomer} value={this.state.custName }placeholder="customer" required type="text" name="customer" id="customer" className="form-control" />
                      <label htmlFor="customer">Customer Name</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input onChange={this.handleChangeDate} value={this.state.apptDate} placeholder="date" required type="text" name="date" id="date" className="form-control" />
                      <label htmlFor="date">Appointment Date (YYYY-MM-DD HH:MM)</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input onChange={this.handleChangeTechnician} value={this.state.technician} placeholder="technician" required type="integer" name="technician" id="technician" className="form-control" />
                      <label htmlFor="technician">Technician Employee Number</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input onChange={this.handleChangeReason} value={this.state.apptReason} placeholder="reason" required type="text" name="reason" id="reason" className="form-control" />
                      <label htmlFor="reason">Reason for Appointment</label>
                    </div>
                    <button className="btn btn-primary">Create</button>
                  </form>
                </div>
              </div>
            </div>
        );
    }

}

export default NewApptForm;

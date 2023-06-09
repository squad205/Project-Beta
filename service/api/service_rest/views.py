from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import json
from common.json import ModelEncoder
from .models import AutomobileVO, Technician, Appointment


class AutomobileVODetailEncoder(ModelEncoder):
    model = AutomobileVO
    properties = [
        "import_href",
        "vin"
    ]
    def get_extra_data(self, o):
        return {"automobile": o.automobile.vin}



class TechnicianDetailEncoder(ModelEncoder):
    model = Technician
    properties = [
        "id",
        "emp_name",
        "emp_number"
    ]


class AppointmentListEncoder(ModelEncoder):
    model = Appointment
    properties = [
        "id",
        "vin",
        "cust_name",
        "appt_date",
        "technician",
        "appt_reason",
        "status",
        "vip",

    ]
    encoders = {"technician":TechnicianDetailEncoder()}

class AppointmentDetailEncoder(ModelEncoder):
    model = Appointment
    properties = [
        "id",
        "vin",
        "cust_name",
        "appt_date",
        "technician",
        "appt_reason",
        "status",
        "vip"

    ]
    encoders = {
        "technician":
        TechnicianDetailEncoder(),
    }


@require_http_methods(["GET", "POST"])
def api_techs(request):
    if request.method == "GET":
        technicians = Technician.objects.all()
        return JsonResponse(
            {"technicians": technicians},
            encoder=TechnicianDetailEncoder,
        )
    else:
        content = json.loads(request.body)

        technician = Technician.objects.create(**content)
        return JsonResponse(
            technician,
            encoder=TechnicianDetailEncoder,
            safe=False
        )

@require_http_methods(["GET", "POST"])
def api_list_appt(request, vin_vo_id=None):
    if request.method == "GET":
        if vin_vo_id is not None:
            appointments = Appointment.objects.filter(vin=vin_vo_id)
        else:
            appointments = Appointment.objects.all()
            return JsonResponse(
                {"appointments" : appointments},
                encoder = AppointmentListEncoder
        )
    else:
        content = json.loads(request.body)

        try:
            tech_id = content["technician"]
            technician = Technician.objects.get(emp_number=tech_id)
            content["technician"]= technician
            try:
                if AutomobileVO.objects.get(vin=content["vin"]):
                    content["vip"] =True
            except:
                pass

        except Technician.DoesNotExist:
            return JsonResponse(
                {"message": "invalid technician"},
                status=400,
            )

        appointments = Appointment.objects.create(**content)
        return JsonResponse(
            appointments,
            encoder=AppointmentDetailEncoder,
            safe = False,
        )

@require_http_methods(["DELETE", "GET", "PUT"])
def api_show_appt(request, pk):
    if request.method == "GET":
        appointment = Appointment.objects.get(id=pk)
        return JsonResponse(
            appointment,
            encoder=AppointmentDetailEncoder,
            safe = False,
        )
    elif request.method == "DELETE":
        count, _ = Appointment.objects.filter(id=pk).delete()
        return JsonResponse({"deleted": count > 0})
    else:
        try:
            content = json.loads(request.body)
            appointment = Appointment.objects.get(id=pk)

            props = ["status"]
            for prop in props:
                if prop in content:
                    setattr(appointment, prop, content[prop])
            appointment.save()
            return JsonResponse(
                appointment,
                encoder = AppointmentDetailEncoder,
                safe=False
            )

        except Appointment.DoesNotExist:
            response = JsonResponse({"message": "This appointment does not exist"},
            status=400,
            )
        Appointment.objects.filter(id=pk).update(**content)
        appointment = Appointment.objects.get(id=pk)
        return JsonResponse(
            appointment,
            encoder = AppointmentDetailEncoder,
            safe=False,
        )

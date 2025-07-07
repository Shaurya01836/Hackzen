"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "../../../components/CommonUI/card"
import { Button } from "../../../components/CommonUI/button"
import { Badge } from "../../../components/CommonUI/badge"
import { Plus, Upload, Info } from "lucide-react"

export default function CertificatesPage() {
  const [templates, setTemplates] = useState([]) // <-- default removed

  useEffect(() => {
    fetch("http://localhost:3000/api/certificate-pages")
      .then((res) => res.json())
      .then((data) => setTemplates(data))
      .catch((err) => console.error("Failed to load templates:", err))
  }, [])

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Manage Certificates</h1>
        <p className="text-gray-600">Create, upload, or reuse certificates to share with participants or winners.</p>
      </div>

      {/* Certificate Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card
            key={template._id}
            className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer h-64"
          >
            <CardContent className="p-0 h-full relative">
              {/* Certificate Preview - Full Card Background */}
              <div className="absolute inset-0 h-full w-full">
                <img
                  src={template.preview || "/placeholder.svg"}
                  alt={template.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
              </div>

              <Badge
                variant="secondary"
                className="absolute top-3 right-3 z-10"
              >
                Template
              </Badge>

              <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 z-10">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-white text-lg drop-shadow-lg">{template.title}</h3>
                    <p className="text-sm text-white/90 drop-shadow-md line-clamp-2">{template.description}</p>
                  </div>
                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-lg"
                    size="sm"
                  >
                    Use This Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Upload New Template Card */}
        <Card className="group relative overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 transition-all duration-300 hover:border-indigo-400 hover:bg-indigo-50/50 hover:shadow-xl hover:scale-[1.02] cursor-pointer h-64">
          <CardContent className="p-0 h-full">
            <div className="h-full flex flex-col items-center justify-center gap-4 text-center p-6">
              <div className="rounded-full bg-white p-4 shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                <Plus className="h-8 w-8 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700 group-hover:text-indigo-700 transition-colors">
                  Upload Your Own
                </h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                  Add a custom certificate template
                </p>
              </div>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-indigo-700 hover:bg-indigo-50 transition-colors bg-transparent"
                size="sm"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Note */}
      <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-yellow-100 p-1">
            <Info className="h-4 w-4 text-yellow-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-yellow-800">
              <span className="font-medium">Automatic Branding:</span> All certificate templates automatically include
              your organization name and HackZen branding for authenticity.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

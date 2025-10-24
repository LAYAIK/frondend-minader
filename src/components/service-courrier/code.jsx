import CreatableSelect from "react-select/creatable";

<Form.Group className="mb-3" controlId="objet">
  <Form.Label style={{ fontWeight: "bold" }}>Objet</Form.Label>
  <CreatableSelect
    isClearable
    isDisabled={isLoading}
    options={DataObjet.map((item) => ({
      value: item.id_objet,
      label: item.libelle,
    }))}
    placeholder="Sélectionner ou créer un nouvel objet..."
    onChange={(selected) => {
      setFormData({
        ...formData,
        id_objet: selected ? selected.value : "",
        nouvel_objet: selected && !DataObjet.some(o => o.id_objet === selected.value)
          ? selected.label
          : "",
      });
    }}
  />
</Form.Group>
<form
  onSubmit={(e) => {
    e.preventDefault();
    handleSubmit();
  }}
  style={{
    background: "white",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "10px"
  }}
>

  <h3>{editIndex !== null ? "Edit Case" : "Add Case"}</h3>

  <input
    placeholder="Case Number"
    value={form.caseNumber}
    onChange={(e) => {
      console.log("typing", e.target.value);
      setForm((prev) => ({ ...prev, caseNumber: e.target.value }));
    }}
    style={{ display: "block", marginBottom: "10px", width: "300px" }}
  />

  <input
    placeholder="Petitioner"
    value={form.petitioner}
    onChange={(e) =>
      setForm((prev) => ({ ...prev, petitioner: e.target.value }))
    }
    style={{ display: "block", marginBottom: "10px", width: "300px" }}
  />

  <button type="submit">Add Case</button>

</form>
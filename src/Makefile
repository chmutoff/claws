# The UUID of the extension.
extension_uuid := claws@alicante.university.project

# The zip application to be used.
ZIP := zip

# The target location of the build and build files.
bin_dir := ../bin

# The target XPI file.
xpi_file := $(bin_dir)/$(extension_uuid).xpi

# This builds the extension XPI file.
.PHONY: all
all: $(xpi_file)
	@echo
	@echo "Build finished successfully."
	@echo

# This cleans all temporary files and directories created by 'make'.
.PHONY: clean
clean:
	@rm -f $(xpi_file)
	@echo "Cleanup is done."

# The sources for the XPI file.
xpi_built := install.rdf \
	chrome.manifest \
	$(wildcard chrome/content/*.js) \
	$(wildcard chrome/content/*.xul) \
	$(wildcard chrome/content/*.xml) \
	$(wildcard chrome/content/*.html) \
	$(wildcard chrome/content/*.css) \
	$(wildcard chrome/content/js/*.js) \
	$(wildcard chrome/icons/default/*.ico) \
	$(wildcard chrome/locale/*/*.dtd) \
	$(wildcard chrome/locale/*/*.properties)\
	$(wildcard chrome/skin/*.css) \
	$(wildcard chrome/skin/*.png) \
	$(wildcard defaults/preferences/*.js) \
	$(wildcard modules/*.js)

$(xpi_file): $(xpi_built)
	@echo "Creating XPI file."
	@$(ZIP) $(xpi_file) $(xpi_built)
	@echo "Creating XPI file. Done!"